<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class PersonnelLogs extends Model
{
  public function getColumns(): array {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'personnel_id' => ['VARCHAR(255)', 'NOT NULL'],
      'activity' => ['TEXT', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getForeignConstraints(): array {
    return [
      'personnel_id' => [Personnel::class, 'CASCADE', 'CASCADE'],
    ];
  }
}
