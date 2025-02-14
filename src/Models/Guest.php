<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Guest extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'email' => ['VARCHAR(191)', 'NOT NULL'],
      'full_name' => ['VARCHAR(191)', 'NOT NULL'],
      'password' => ['VARCHAR(191)', 'NOT NULL'],
      'role' => ["ENUM('student', 'employee', 'others')", 'NOT NULL', "DEFAULT 'student'"],
      'school' => ['VARCHAR(191)'],
      'position' => ['VARCHAR(191)'],
      'reasons' => ['TEXT', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getUniqueKeys(): array
  {
    return [
      ['email']
    ];
  }

}
