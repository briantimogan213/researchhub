<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Thesis extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'title' => ['VARCHAR(191)', 'NOT NULL'],
      'author' => ['VARCHAR(191)', 'NOT NULL'],
      'year' => ['YEAR', 'NOT NULL'],
      'department' => ['VARCHAR(191)', 'NOT NULL'],
      'course' => ['VARCHAR(191)', 'NOT NULL'],
      'adviser' => ['VARCHAR(191)', "DEFAULT ''"],
      'url' => ['TEXT', 'NOT NULL'],
      'abstract' => ['TEXT', 'NOT NULL'],
      'is_public' => ['BOOLEAN', 'DEFAULT FALSE'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getUniqueKeys(): array
  {
    return [
      ['title']
    ];
  }

}
