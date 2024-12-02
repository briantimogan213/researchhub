<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Downloadables extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'title' => ['VARCHAR(255)', 'NOT NULL'],
      'name' => ['VARCHAR(255)', 'NOT NULL'],
      'ext' => ['VARCHAR(15)', 'NOT NULL'],
      'url' => ['VARCHAR(255)', 'NOT NULL'],
      'downloadable' => ['BOOLEAN', 'DEFAULT FALSE'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getUniqueKeys(): array
  {
    return [
      ['name'],
    ];
  }

}
