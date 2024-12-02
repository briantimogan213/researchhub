<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Student extends Model
{
  public function getColumns(): array {
    return [
      'student_id' => ['BIGINT', 'NOT NULL'],
      'full_name' => ['VARCHAR(255)', 'NOT NULL'],
      'password' => ['VARCHAR(255)', 'NOT NULL'],
      'email' => ['VARCHAR(255)', 'NOT NULL'],
      'department' => ['VARCHAR(255)', 'NOT NULL'],
      'course' => ['VARCHAR(255)', 'NOT NULL'],
      'year' => ["ENUM('1','2','3','4')", 'NOT NULL'],
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