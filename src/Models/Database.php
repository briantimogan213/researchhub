<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

use PDO;
use ReflectionClass;
use Smcc\ResearchHub\Logger\Logger;

interface BaseDatabase
{
  public function getRowById(string $modelClass, int $id): object|false;
  public function fetchOne(string $modelClass, array $conditions = []): object|false;
  public function getAllRows(string $modelClass): array;
  public function fetchMany(string $modelClass, array $conditions = []): array;
  public function search(string $modelClass, array $conditions = []): array;
  public function getRowCount(string $modelClass, array $conditions = []);
}

$_open_database = null;

class Database implements BaseDatabase
{
  private ?PDO $db;

  public function __construct(string $host = MYSQL_HOST, string $port = MYSQL_PORT, string $dbname = MYSQL_DATABASE, string $user = MYSQL_USER, string $password = MYSQL_PASSWORD)
  {
    global $_open_database;
    // Logger::write_debug("Connecting to database: $host, $port, $dbname, $user, $password");
    // Check if database connection already exists
    if (!is_null($_open_database)) {
      Logger::write_debug("Database connection already exists.");
      return;
    }
    // implement database connection using PDO mysql
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_PROPS_LATE,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $this->db = new PDO($dsn, $user, $password, $options);
    $_open_database = $this;
    // Logger::write_debug("Connecting to database: HOST=$host, PORT=$port, USER={$this->quoteIdentifier($user)}, DATABASE={$this->quoteIdentifier($dbname)}");
    // Logger::write_debug("Database connection established successfully.");

    $models = array_map(fn($t) => new $t([], true), getAllModels());

    // Logger::write_debug("\nCreating tables if not exists:\n"
    //   . implode(
    //       "\n",
    //       array_map(
    //         fn($t) => "{$this->quoteIdentifier($dbname)}.{$this->quoteIdentifier($t->getTableName())}",
    //         $models
    //       )
    //     )
    //   );
    // Create tables for all models
    foreach ($models as $model) {
      $model->createTable($this);
    }

    // Logger::write_debug("\nAlter table for foreign key constraints if not exists:\n"
    // . implode(
    //     "\n",
    //     array_map(
    //       fn($t) => implode(", ", array_map(fn($k) => $this->quoteIdentifier($t->getTableName()). ".". $this->quoteIdentifier($k), array_keys($t->getForeignConstraints()))),
    //       array_filter($models, fn($t) => count($t->getForeignConstraints()) > 0)
    //     )
    //   )
    // );

    // alter table for foreign key constraints for all models
    foreach ($models as $model) {
      $model->createForeignConstraints($this);
    }

    // Logger::write_debug("Database tables migrated completed successfully.");
    // Logger::write_debug("\nTable row counts:\n"
    // . implode(
    //   "\n",
    //     array_map(
    //       fn($t) => "{$this->quoteIdentifier($dbname)}.{$this->quoteIdentifier($t->getTableName())} = {$t::getRowCount()} records",
    //       $models
    //     )
    //   )
    // );
  }

  public function getDb(): PDO
  {
    return $this->db;
  }

  static function getInstance(): Database
  {
    global $_open_database;
    if (is_null($_open_database)) {
      $_open_database = new Database();
    }
    return $_open_database;
  }
  /**
   * @inheritDoc
   */
  public function getAllRows(string $modelClass): array
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      $stmt = $this->db->prepare("SELECT * FROM {$model->getTableName()}");
      if ($stmt->execute()) {
        return $stmt->fetchAll(PDO::FETCH_CLASS, $modelClass);
      }
    }
    return [];
  }

  /**
   * @inheritDoc
   */
  public function getRowById(string $modelClass, mixed $id): object|false
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      $stmt = $this->db->prepare("SELECT * FROM {$model->getTableName()} WHERE {$model->getPrimaryKey()} = :{$model->getPrimaryKey()}");
      $stmt->bindParam(":{$model->getPrimaryKey()}", $id);
      if ($stmt->execute()) {
        return $stmt->fetchObject($modelClass);
      }
    }
    return false;
  }
  /**
   * @inheritDoc
   */
  public function fetchMany(string $modelClass, array $conditions = []): array
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      // select many rows using prepared statements and return the results array of models
      $sql = "SELECT * FROM {$model->getTableName()} WHERE " . implode(' AND ', array_map(fn ($key) => "$key = :$key", array_keys($conditions), []));
      $stmt = $this->db->prepare($sql);
      foreach ($conditions as $key => $value) {
        $stmt->bindValue(":$key", $value);
      }
      if ($stmt->execute()) {
        return $stmt->fetchAll(PDO::FETCH_CLASS, $modelClass);
      }
    }
    return [];
  }

  /**
   * @inheritDoc
   */
  public function search(string $modelClass, array $conditions = []): array
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      // select many rows using prepared statements and return the results array of models
      $sql = "SELECT * FROM {$model->getTableName()} WHERE " . implode(' AND ', array_map(fn ($key) => "$key LIKE :$key", array_keys($conditions), []));
      $stmt = $this->db->prepare($sql);
      foreach ($conditions as $key => $value) {
        $stmt->bindValue(":$key", "%$value%");
      }
      if ($stmt->execute()) {
        return $stmt->fetchAll(PDO::FETCH_CLASS, $modelClass);
      }
    }
    return [];
  }

  /**
   * @inheritDoc
   */
  public function fetchOne(string $modelClass, array $conditions = []): object|false
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      // select one row using prepared statements and return the model object
      $sql = "SELECT * FROM {$model->getTableName()} WHERE " . implode(' AND ', array_map(fn ($key) => "$key = :$key", array_keys($conditions), []));
      $stmt = $this->db->prepare($sql);
      foreach ($conditions as $key => $value) {
        $stmt->bindValue(":$key", strval($value));
      }
      if ($stmt->execute()) {
        $obj = $stmt->fetchObject($modelClass);
        if ($obj !== false) {
          return $obj;
        }
      }
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  public function getRowCount(string $modelClass, array $conditions = []): int
  {
    if (is_subclass_of($modelClass, Model::class)) {
      $model = new $modelClass();
      $sql = (count($conditions) > 0) ? "SELECT COUNT(*) as count FROM {$model->getTableName()} WHERE " . implode(' AND ', array_map(fn($key) => "$key = :$key", array_keys($conditions), [])) : "SELECT COUNT(*) as count FROM {$model->getTableName()}";
      $stmt = $this->db->prepare($sql);
      foreach ($conditions as $key => $value) {
        $stmt->bindValue(":$key", $value);
      }
      if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $row['count'];
      }
    }
    return 0;
  }

  // Quote identifiers (table names, column names, etc.)
  public function quoteIdentifier(string $identifier)
  {
      return '`' . str_replace('`', '``', $identifier) . '`';
  }

  public function __destruct()
  {
    global $_open_database;
    // close database connection when object is destroyed
    if (!is_null($_open_database)) {
      $_open_database = null;
      $this->db = null;
    }
  }
}

function getAllModels(): array
{
  $tables = [];
  $directory = MODELS_PATH;
  $namespace = "Smcc\\ResearchHub\\Models";
  foreach (scandir($directory) as $file) {
    if ($file !== '.' && $file !== '..' && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
      $className = $namespace . "\\" . pathinfo($file, PATHINFO_FILENAME);
      if (class_exists($className)) {
        $reflection = new ReflectionClass($className);
        if ($reflection->isSubclassOf(Model::class)) {
          $tables[] = $className;
        }
      }
    }
  }

  return $tables;
}