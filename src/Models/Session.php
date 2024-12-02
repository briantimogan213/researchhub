<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

class Session extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'session_id' => ['VARCHAR(255)', 'NOT NULL'],
      'ip_address' => ['VARCHAR(64)', 'NOT NULL'],
      'user_agent' => ['VARCHAR(512)', 'NOT NULL'],
      'token' => ['TEXT',],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getUniqueKeys(): array
  {
    return [
      ['session_id', 'ip_address', 'user_agent'],
    ];
  }
}
