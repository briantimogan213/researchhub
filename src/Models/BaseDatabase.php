<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

interface BaseDatabase
{
  /**
   * @param $id string|int
   * @return object|false
   */
  public function getRowById(string $modelClass, $id);
  /**
   * @return object|false
   */
  public function fetchOne(string $modelClass, array $conditions = []);
  public function getAllRows(string $modelClass): array;
  public function fetchMany(string $modelClass, array $conditions = []): array;
  public function search(string $modelClass, array $conditions = []): array;
  public function getRowCount(string $modelClass, array $conditions = []);
}
