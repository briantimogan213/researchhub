<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class ThesisPersonnelReads extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'thesis_id' => ['BIGINT', 'NOT NULL'],
      'personnel_id' => ['VARCHAR(255)', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getForeignConstraints(): array
  {
    return [
      'thesis_id' => [Thesis::class, 'CASCADE', 'CASCADE'],
      'personnel_id' => [Personnel::class, 'CASCADE', 'CASCADE'],
    ];
  }
}
