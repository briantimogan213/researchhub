<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;


class Announcements extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'a_type' => ["ENUM('video', 'text')", 'NOT NULL', "DEFAULT 'text'"],
      'title' => ['TEXT', 'NOT NULL'],
      'url' => ['TEXT'],
      'message' => ['TEXT'],
      'expires' => ['TIMESTAMP', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }

}
