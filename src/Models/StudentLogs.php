<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class StudentLogs extends Model
{
  public function getColumns(): array {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'student_id' => ['BIGINT', 'NOT NULL'],
      'activity' => ['TEXT', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getForeignConstraints(): array {
    return [
      'student_id' => [Student::class, 'CASCADE', 'CASCADE'],
    ];
  }
}
