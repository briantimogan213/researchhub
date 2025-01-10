<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Guest extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'email' => ['VARCHAR(255)', 'NOT NULL'],
      'full_name' => ['VARCHAR(255)', 'NOT NULL'],
      'password' => ['VARCHAR(255)', 'NOT NULL'],
      'role' => ["ENUM('student', 'employee', 'others')", 'NOT NULL', "DEFAULT 'student'"],
      'school' => ['VARCHAR(255)'],
      'position' => ['VARCHAR(255)'],
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
