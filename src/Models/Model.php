<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

use DateTime;
use PDO;
use PDOException;
use ReflectionClass;
use Smcc\ResearchHub\Logger\Logger;

interface ModelInterface
{
  function getTableName(): string;
  function getColumns(): array;
  function getPrimaryKey(): string;
  function getPrimaryKeyValue(): mixed;
  function getPrimaryKeyPDOType(): int;
  function getForeignConstraints(): array;
  function getUniqueKeys(): array;
  function createTable(Database $database): void;
  function createForeignConstraints(Database $database): void;
  function get(string $columnName): mixed;
  function create(bool $includePrimaryKeyValue = false): string|false;
  function update(): bool;
  function delete(): bool;
  function toArray(): array;
  function setAttributes(array $attributes): void;
}

// superclass for all model classes
class Model implements ModelInterface
{
  private array $data = [];
  private bool $isCreateOnly = false;

  public const FOREIGN_KEY_PREFIX = 'fk_';

  public static function getRowCount(): int
  {
    $db = Database::getInstance();
    return $db->getRowCount(static::class);
  }

  public function __construct(array $data = [], bool $isCreateOnly = false, ...$args)
  {
    if ($isCreateOnly) {
      $this->isCreateOnly = true;
    } else {
      // Initialize properties
      foreach (array_keys($this->getColumns()) as $columnName) {
        $this->initializeProperty($columnName);
      }
      foreach ($data as $columnName => $value) {
        if (array_key_exists($columnName, $this->getColumns())) {
          $this->data[$columnName] = $value;
        }
      }
    }
  }

  public function __get(string $propertyName)
  {
    if (!$this->isCreateOnly && (array_key_exists($propertyName, $this->data) || array_key_exists(str_replace(static::FOREIGN_KEY_PREFIX, "", $propertyName), $this->data))) {
      // check datatypes from getColumns() then cast datatypes equal to the declared types for database types
      if (array_key_exists($propertyName, $this->getColumns())) {
        $col = $this->getColumns()[$propertyName];
        if (str_starts_with($col[0], 'BIGINT') || str_starts_with($col[0], 'INT') || str_starts_with($col[0], 'YEAR')) {
          return (int) intval($this->data[$propertyName]);
        } else if (str_starts_with($col[0], 'DECIMAL') || str_starts_with($col[0], 'FLOAT') || str_starts_with($col[0], 'DOUBLE')) {
          return (float) floatval($this->data[$propertyName]);
        } else if (str_starts_with($col[0], 'TIMESTAMP') || str_starts_with($col[0], 'DATE') || str_starts_with($col[0], 'TIME') || str_starts_with($col[0], 'DATETIME')) {
          return new DateTime($this->data[$propertyName]);
        } else if (str_starts_with($col[0], 'TINYINT') || str_starts_with($col[0], 'BOOLEAN')) {
          return (bool) boolval($this->data[$propertyName]);
        }
      } else if (array_key_exists(str_replace(static::FOREIGN_KEY_PREFIX, "", $propertyName), $this->getForeignConstraints())) {
        $fkName = substr($propertyName, strlen(static::FOREIGN_KEY_PREFIX));
        [$modelClass, $onUpdate, $onDelete] = $this->getForeignConstraints()[$fkName];
        if (class_exists($modelClass)) {
          $reflection = new ReflectionClass($modelClass);
          if ($reflection->isSubclassOf(self::class)) {
            return $this->fetchForeignKey($modelClass, $this->{str_replace(static::FOREIGN_KEY_PREFIX, "", $propertyName)});
          }
        }
      }
    }
    // all else
    return $this->data[$propertyName] ?? null;
  }

  public function __set(string $propertyName, $value): void
  {
    if (!$this->isCreateOnly && array_key_exists($propertyName, $this->getColumns())) {
      $this->data[$propertyName] = $value;
    }
  }

  public function setAttributes(array $attributes): void
  {
    foreach ($attributes as $key => $value) {
      $this->__set($key, $value);
    }
  }

  private function initializeProperty(string $columnName): void
  {
    if (!array_key_exists($columnName, $this->data)) {
      $this->data[$columnName] = null;
    }
  }

  private function fetchForeignKey(string $modelClass, $fkValue)
  {
    if (is_null($fkValue)) {
      return null;
    }

    $db = Database::getInstance();

    $model = new $modelClass();
    $primaryKey = $model->getPrimaryKey();

    return $db->fetchOne($modelClass, [$primaryKey => $fkValue]);
  }

  public function createTable(Database $db): void
  {
    if ($this->isCreateOnly && count($this->getColumns()) > 0) {
      $columns = $this->getColumns();
      $tableName = $this->getTableName();

      // Construct the column definitions
      $columnDefinitions = [];
      foreach ($columns as $columnName => $attributes) {
        $columnDefinitions[] = "$columnName " . implode(' ', $attributes);
      }

      // Create the table SQL
      $sql = "CREATE TABLE IF NOT EXISTS $tableName (" . implode(', ', $columnDefinitions);

      // Add primary key
      $primaryKey = $this->getPrimaryKey();
      $sql .= ", PRIMARY KEY ($primaryKey)";

      // Add unique keys
      foreach ($this->getUniqueKeys() as $uniqueKey) {
        $sql .= ", UNIQUE (" . implode(', ', $uniqueKey) . ")";
      }

      // Close the SQL statement
      $sql .= ") ENGINE=InnoDB;";

      // Logger::write_debug("Creating table: $sql");

      // Execute the table creation
      $db->getDb()->exec($sql);
    }
  }

  public function createForeignConstraints(Database $db): void
  {
    if ($this->isCreateOnly && count(array_keys($this->getForeignConstraints())) > 0) {
      $tableName = $this->getTableName();
      // Add foreign key constraints
      foreach ($this->getForeignConstraints() as $fkColumn => $fkDetails) {
        [$modelClass, $onUpdate, $onDelete] = $fkDetails;
        if (class_exists($modelClass)) {
          $reflection = new ReflectionClass($modelClass);
          if ($reflection->isSubclassOf(self::class)) {
            $fkModel = new $modelClass();
            $referencedColumn = $fkModel->getPrimaryKey();
            $referencedTable = $fkModel->getTableName();
            $sql = "ALTER TABLE $tableName ADD CONSTRAINT fk_{$tableName}_{$fkColumn}
                    FOREIGN KEY ($fkColumn) REFERENCES $referencedTable($referencedColumn)
                    ON UPDATE $onUpdate
                    ON DELETE $onDelete;";
            try {
              $db->getDb()->exec($sql);
            } catch (PDOException $e) {}
          }
        }
      }
    }
  }

  /**
   * @inheritDoc
   */
  public function create(bool $includePrimaryKeyValue = false): string|false
  {
    if (!$this->isCreateOnly) {
      $db = Database::getInstance();

      $columns = $includePrimaryKeyValue ? array_filter(array_keys($this->getColumns()), fn($k) => !is_null($this->get($k))) : array_filter(array_keys($this->getColumns()), fn($col) => $col !== $this->getPrimaryKey() && !is_null($this->get($col)));
      $colNames = implode(",", $columns);
      $colNameParams = implode(",", array_map(fn ($key) => ":$key", $columns));
      $db->getDb()->beginTransaction();
      $stmt = $db->getDb()->prepare(
        "INSERT INTO {$this->getTableName()} ($colNames) VALUES($colNameParams)"
      );

      // Bind parameters
      foreach ($columns as $colName) {
        $paramName = ":$colName";
        $args = $this->getColumns()[$colName];
        $value = $this->data[$colName];
        if (str_starts_with($args[0], "BIGINT") || str_starts_with($args[0], "INT")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_INT);
        } else if (str_starts_with($args[0], "TINYINT") || str_starts_with($args[0], "BOOLEAN")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_BOOL);
        } else if (str_starts_with($args[0], "BLOB") || str_starts_with($args[0], "TINYBLOB") || str_starts_with($args[0], "MEDIUMBLOB") || str_starts_with($args[0], "LONGBLOB")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_LOB);
        } else if (str_starts_with($args[0], "CHAR")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_STR_CHAR);
        } else {
          $stmt->bindValue($paramName, $value);
        }
      }

      // Execute statement
      if (!$stmt->execute())
      {
        $db->getDb()->rollBack();
        return false;
      }
      $lastInsertedId = $includePrimaryKeyValue ? $this->getPrimaryKeyValue() : $db->getDb()->lastInsertId();
      $db->getDb()->commit();
      // Retrieve the last inserted
      return $lastInsertedId;
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  public function update(): bool
  {
    if (!$this->isCreateOnly) {
      $db = Database::getInstance();
      $primaryKey = $this->getPrimaryKey();
      $primaryKeyValue = $this->getPrimaryKeyValue();
      $primaryKeyPDOType = $this->getPrimaryKeyPDOType();
      $c = array_keys($this->getColumns());
      $columns = array_filter($c, fn($colName) => $colName !== $primaryKey && $colName !== "updated_at" && $colName !== "created_at");
      $setClause = implode(", ", array_map(fn ($col) => "$col = :$col", $columns));

      $sql = "UPDATE {$this->getTableName()} SET $setClause WHERE $primaryKey = :$primaryKey";
      $db->getDb()->beginTransaction();
      $stmt = $db->getDb()->prepare($sql);

      // Bind parameters
      foreach ($columns as $colName) {
        $paramName = ":$colName";
        $args = $this->getColumns()[$colName];
        $value = $this->data[$colName];
        if (str_starts_with($args[0], "BIGINT") || str_starts_with($args[0], "INT")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_INT);
        } else if (str_starts_with($args[0], "TINYINT") || str_starts_with($args[0], "BOOLEAN")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_BOOL);
        } else if (str_starts_with($args[0], "BLOB") || str_starts_with($args[0], "TINYBLOB") || str_starts_with($args[0], "MEDIUMBLOB") || str_starts_with($args[0], "LONGBLOB")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_LOB);
        } else if (str_starts_with($args[0], "CHAR")) {
          $stmt->bindValue($paramName, $value, PDO::PARAM_STR_CHAR);
        } else {
          $stmt->bindValue($paramName, $value);
        }
      }

      // Bind primary key value
      $stmt->bindValue(":$primaryKey", $primaryKeyValue, $primaryKeyPDOType);

      $result = $stmt->execute();
      if (!$result) {
        $db->getDb()->rollBack();
        return false;
      }
      $ok = $db->getDb()->commit();
      return $ok;
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  public function delete(): bool {
    if (!$this->isCreateOnly) {
      $db = Database::getInstance();
      $primaryKey = $this->getPrimaryKey();
      $primaryKeyValue = $this->getPrimaryKeyValue();
      $primaryKeyPDOType = $this->getPrimaryKeyPDOType();
      if ($primaryKeyValue !== null) {
        $sql = "DELETE FROM {$this->getTableName()} WHERE $primaryKey = :$primaryKey";
        $stmt = $db->getDb()->prepare($sql);
        $stmt->bindValue(":$primaryKey", $primaryKeyValue, $primaryKeyPDOType);
        $result = $stmt->execute();
        return $result;
      }
    }
    return false;
  }
  /**
   * @inheritDoc
   */
  public function getPrimaryKey(): string
  {
    return array_key_first($this->getColumns()) ?? '';
  }
  /**
   * @inheritDoc
   */
  public function getPrimaryKeyValue(): mixed
  {
    if (!$this->isCreateOnly && $this->getPrimaryKey() !== '') {
      return $this->data[$this->getPrimaryKey()];
    }
    return null;
  }

  /**
   * @inheritDoc
   */
  public function getPrimaryKeyPDOType(): int
  {
    if (!$this->isCreateOnly && $this->getPrimaryKey() !== '') {
      $colArgs = $this->getColumns()[$this->getPrimaryKey()];
      if (str_starts_with($colArgs[0], 'BIGINT') || str_starts_with($colArgs[0], 'INT')) {
        return PDO::PARAM_INT;
      }
      return PDO::PARAM_STR;
    }
    return PDO::PARAM_NULL;
  }
  /**
   * @inheritDoc
   */
  public function getColumns(): array
  {
    return [
      // 'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      // 'fullname' => ['VARCHAR(255)', 'NOT NULL'],
      // 'parent' => ['BIGINT'],
      // 'age' => ['INT', 'NOT NULL'],
      // 'price' => ['DECIMAL(10,2)', 'NOT NULL'],
      // 'percentage' => ['FLOAT', 'NOT NULL'],
      // 'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      // 'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT'],
    ];
  }

  /**
   * @inheritDoc
   */
  public function getForeignConstraints(): array
  {
    return [
    //   'parent' /* foreign key column name */ => [
    //     static::class, /* Model class name */
    //     'CASCADE' /* ON UPDATE */,
    //     'SET NULL' /* ON DELETE */
    //   ]
    ];
  }

  /**
   * @inheritDoc
   */
  public function getTableName(): string
  {
    return strtolower(basename(str_replace('\\', '/', static::class)));
  }

  /**
   * @inheritDoc
   */
  public function getUniqueKeys(): array
  {
    return [
      // ['fullname', 'parent', 'age'],
    ];
  }
  /**
   * @inheritDoc
   */
  public function get(string $columnName): mixed {
    if (!$this->isCreateOnly && $this->getPrimaryKey() !== '' && array_key_exists($columnName, $this->data)) {
      return $this->data[$columnName];
    }
    return null;
  }
  /**
   * @inheritDoc
   */
  public function toArray(bool $includeForeignKeys = false, bool $includeChildrenForeignKeys = false): array {
    if ($includeForeignKeys) {
      return [...$this->data] + array_reduce(
        array_keys($this->getForeignConstraints()),
        function($init, $fkname) use ($includeChildrenForeignKeys) {
          $fkValue = $this->{static::FOREIGN_KEY_PREFIX . $fkname};
          $init[static::FOREIGN_KEY_PREFIX . $fkname] = !$fkValue ? null : $fkValue->toArray($includeChildrenForeignKeys);
          return $init;
        },
        []
      );
    }
    return [...$this->data];
  }

}

