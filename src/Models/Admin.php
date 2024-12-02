<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

use Smcc\ResearchHub\Logger\Logger;

class Admin extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'admin_user' => ['VARCHAR(255)', 'NOT NULL'],
      'full_name' => ['VARCHAR(255)', 'NOT NULL'],
      'email' => ['VARCHAR(255)', 'NOT NULL'],
      'password' => ['VARCHAR(255)', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getUniqueKeys(): array
  {
    return [
      ['admin_user']
    ];
  }

  public static function seed(): void
  {
    if (self::getRowCount() === 0) {
      try {
        $admin = new Admin(['admin_user' => 'admin', 'full_name' => 'System Administrator', 'email' => 'admin@smccnasipit.edu.ph', 'password' => password_hash('adminpassword', PASSWORD_DEFAULT)]);
        $admin->create();
        Logger::write_info("System Administrator account has been created. Username: admin, Password: adminpassword, Email: admin@smccnasipit.edu.ph");
      } catch (\Throwable $e) {
        Logger::write_error("Failed to create System Administrator account: {$e->getMessage()}");
      }
    }
  }
}
