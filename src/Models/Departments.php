<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

use Smcc\ResearchHub\Logger\Logger;


class Departments extends Model
{
  public function getColumns(): array
  {
    return [
      'id' => ['BIGINT', 'NOT NULL', 'AUTO_INCREMENT'],
      'department' => ['VARCHAR(191)', 'NOT NULL'],
      'created_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'],
      'updated_at' => ['TIMESTAMP', 'NOT NULL', 'DEFAULT CURRENT_TIMESTAMP', 'ON UPDATE CURRENT_TIMESTAMP'],
    ];
  }
  public function getUniqueKeys(): array
  {
    return [
      ['department']
    ];
  }

  public static function seed(): void
  {
    if (self::getRowCount() === 0) {
      $departments = [
        [
          'id' => 1,
          'department' => 'College of Computing and Information Sciences',
        ],
        [
          'id' => 2,
          'department' => 'College of Arts and Sciences',
        ],
        [
          'id' => 3,
          'department' => 'College of Business Management',
        ],
        [
          'id' => 4,
          'department' => 'College of Criminal Justice Education',
        ],
        [
          'id' => 5,
          'department' => 'College of Teacher Education',
        ],
        [
          'id' => 6,
          'department' => 'College of Tourism and Hospitality Management',              'created_at' => '2025-01-10 23:36:25',
        ],
        [
          'id' => 7,
          'department' => 'Senior High School',
        ]
      ];
      foreach ($departments as $dep) {
        try {
          $dept = new Departments($dep);
          $dept->create(True);
          $dpname = $dep['department'];
          Logger::write_info("Default Department {$dpname} has been created.");
        } catch (\Throwable $e) {
          Logger::write_error("Failed to create default department: {$e->getMessage()}");
        }
      }
    }
  }

}
