<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class JournalGuestFavorites extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'thesis_id' => ['BIGINT', 'NOT NULL'],
      'guest_id' => ['VARCHAR(255)', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getForeignConstraints(): array
  {
    return [
      'thesis_id' => [Journal::class, 'CASCADE', 'CASCADE'],
      'guest_id' => [Guest::class, 'CASCADE', 'CASCADE'],
    ];
  }
}
