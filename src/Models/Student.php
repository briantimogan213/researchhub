<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Student extends Model
{
  public function getColumns(): array {
    return [
      'student_id' => ['BIGINT', 'NOT NULL'],
      'full_name' => ['VARCHAR(191)', 'NOT NULL'],
      'password' => ['VARCHAR(191)', 'NOT NULL'],
      'email' => ['VARCHAR(191)', 'NOT NULL'],
      'department' => ['VARCHAR(191)', 'NOT NULL'],
      'course' => ['VARCHAR(191)', 'NOT NULL'],
      'year' => ["ENUM('1','2','3','4', '11', '12')", 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getUniqueKeys(): array {
    return [
      ['student_id', 'full_name', 'course']
    ];
  }
}