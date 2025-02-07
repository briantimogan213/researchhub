<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

interface ModelInterface
{
  public function getTableName(): string;
  public function getColumns(): array;
  public function getPrimaryKey(): string;
  public function getPrimaryKeyValue();
  public function getPrimaryKeyPDOType(): int;
  public function getForeignConstraints(): array;
  public function getUniqueKeys(): array;
  public function createTable(Database $database): void;
  public function createForeignConstraints(Database $database): void;
  public function get(string $columnName);
  /**
   * @return string|false
   */
  public function create(bool $includePrimaryKeyValue = false);
  public function update(): bool;
  public function delete(): bool;
  public function toArray(): array;
  public function setAttributes(array $attributes): void;
}