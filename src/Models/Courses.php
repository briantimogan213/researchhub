<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;


class Courses extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'department_id' => ['BIGINT', 'NOT NULL'],
      'course' => ['VARCHAR(255)', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getUniqueKeys(): array
  {
    return [
      ['course', 'department_id']
    ];
  }

  public function getForeignConstraints(): array {
    return [
      'department_id' => [Departments::class, 'CASCADE', 'CASCADE'],
    ];
  }
}
