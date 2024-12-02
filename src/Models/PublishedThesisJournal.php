<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class PublishedThesisJournal extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'journal_id' => ['BIGINT', 'NOT NULL'],
      'thesis_id' => ['BIGINT', 'NOT NULL'],
      'is_public' => ['BOOLEAN', 'DEFAULT FALSE'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

  public function getUniqueKeys(): array
  {
    return [
      ['thesis_id'],
      ['journal_id', 'thesis_id']
    ];
  }

  public function getForeignConstraints(): array
  {
    return [
      'thesis_id' => [Thesis::class, 'CASCADE', 'CASCADE'],
      'journal_id' => [Journal::class, 'CASCADE', 'CASCADE'],
    ];
  }

}
