<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Models;

use Smcc\ResearchHub\Logger\Logger;

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

  public static function seed(): void
  {
    if (self::getRowCount() === 0) {
      $courses = [
        [
            'id' => 1,
            'department_id' => 1,
            'course' => 'BSIT',
            'created_at' => '2025-01-10 23:36:41',
            'updated_at' => '2025-01-10 23:36:41'
        ],
        [
            'id' => 2,
            'department_id' => 1,
            'course' => 'BSCS',
            'created_at' => '2025-01-10 23:36:53',
            'updated_at' => '2025-01-10 23:36:53'
        ],
        [
            'id' => 3,
            'department_id' => 1,
            'course' => 'BLIS',
            'created_at' => '2025-01-10 23:36:58',
            'updated_at' => '2025-01-10 23:36:58'
        ],
        [
            'id' => 4,
            'department_id' => 1,
            'course' => 'DIT',
            'created_at' => '2025-01-10 23:37:08',
            'updated_at' => '2025-01-10 23:37:08'
        ],
        [
            'id' => 5,
            'department_id' => 1,
            'course' => 'BSAIS',
            'created_at' => '2025-01-10 23:37:39',
            'updated_at' => '2025-01-10 23:37:39'
        ],
        [
            'id' => 6,
            'department_id' => 1,
            'course' => 'BSIS',
            'created_at' => '2025-01-10 23:38:01',
            'updated_at' => '2025-01-10 23:38:01'
        ],
        [
            'id' => 7,
            'department_id' => 3,
            'course' => 'BSBAFM',
            'created_at' => '2025-01-10 23:38:22',
            'updated_at' => '2025-01-10 23:38:22'
        ],
        [
            'id' => 8,
            'department_id' => 3,
            'course' => 'BSBAHM',
            'created_at' => '2025-01-10 23:38:40',
            'updated_at' => '2025-01-10 23:38:40'
        ],
        [
            'id' => 9,
            'department_id' => 3,
            'course' => 'BSBAMM',
            'created_at' => '2025-01-10 23:38:45',
            'updated_at' => '2025-01-10 23:38:45'
        ],
        [
            'id' => 10,
            'department_id' => 3,
            'course' => 'BPA',
            'created_at' => '2025-01-10 23:38:51',
            'updated_at' => '2025-01-10 23:38:51'
        ],
        [
            'id' => 11,
            'department_id' => 3,
            'course' => 'BSE',
            'created_at' => '2025-01-10 23:38:55',
            'updated_at' => '2025-01-10 23:38:55'
        ],
        [
            'id' => 12,
            'department_id' => 4,
            'course' => 'BSC',
            'created_at' => '2025-01-10 23:39:10',
            'updated_at' => '2025-01-10 23:39:10'
        ],
        [
            'id' => 13,
            'department_id' => 5,
            'course' => 'BEE',
            'created_at' => '2025-01-10 23:39:19',
            'updated_at' => '2025-01-10 23:39:19'
        ],
        [
            'id' => 14,
            'department_id' => 5,
            'course' => 'BSEE',
            'created_at' => '2025 -01-10 23:39:23',
            'updated_at' => '2025-01-10 23:39:23'
        ],
        [
            'id' => 15,
            'department_id' => 5,
            'course' => 'BSES',
            'created_at' => '2025-01-10 23:39:32',
            'updated_at' => '2025-01-10 23:39:32'
        ],
        [
            'id' => 16,
            'department_id' => 5,
            'course' => 'BSESS',
            'created_at' => '2025-01-10 23:39:38',
            'updated_at' => '2025-01-10 23:39:38'
        ],
        [
            'id' => 17,
            'department_id' => 5,
            'course' => 'BPE',
            'created_at' => '2025-01-10 23:39:46',
            'updated_at' => '2025-01-10 23:39:46'
        ],
        [
            'id' => 18,
            'department_id' => 5,
            'course' => 'BTVTE',
            'created_at' => '2025-01-10 23:40:02',
            'updated_at' => '2025-01-10 23:40:02'
        ],
        [
            'id' => 19,
            'department_id' => 5,
            'course' => 'BECE',
            'created_at' => '2025-01-10 23:40:08',
            'updated_at' => '2025-01-10 23:40:08'
        ],
        [
            'id' => 20,
            'department_id' => 2,
            'course' => 'BAEL',
            'created_at' => '2025-01-10 23:40:19',
            'updated_at' => '2025-01-10 23:40:19'
        ],
        [
            'id' => 21,
            'department_id' => 6,
            'course' => 'BSHM',
            'created_at' => '2025-01-10 23:40:50',
            'updated_at' => '2025-01-10 23:40:50'
        ],
        [
            'id' => 22,
            'department_id' => 6,
            'course' => 'BSTM',
            'created_at' => '2025-01-10 23:40:58',
            'updated_at' => '2025-01-10 23:40:58'
        ],
        [
            'id' => 23,
            'department_id' => 6,
            'course' => 'DHMT',
            'created_at' => '2025-01-10 23:41:24',
            'updated_at' => '2025-01-10 23:41:24'
        ],
        [
            'id' => 24,
            'department_id' => 6,
            'course' => 'DTMT',
            'created_at' => '2025-01-10 23:41:31',
            'updated_at' => '2025-01-10 23:41:31'
        ],
        [
            'id' => 25,
            'department_id' => 6,
            'course' => 'FBNCT II',
            'created_at' => '2025-01-10 23:42:27',
            'updated_at' => '2025-01-10 23:42:27'
        ],
        [
            'id' => 26,
            'department_id' => 6,
            'course' => 'HNC II',
            'created_at' => '2025-01-10 23:42:43',
            'updated_at' => '2025-01-10 23:42:43'
        ],
        [
            'id' => 27,
            'department_id' => 6,
            'course' => 'SCSNCI',
            'created_at' => '2025-01-10 23:42:52',
            'updated_at' => '2025-01-10 23:42:52'
        ],
        [
            'id' => 28,
            'department_id' => 7,
            'course' => 'ABM',
            'created_at' => '2025-01-10 23:43:02',
            'updated_at' => '2025-01-10 23:43:02'
        ],
        [
            'id' => 29,
            'department_id' => 7,
            'course' => 'GAS',
            'created_at' => '2025-01-10 23:43:07',
            'updated_at' => '2025-01-10 23:43:07'
        ],
        [
            'id' => 30,
            'department_id' => 7,
            'course' => 'HUMMS',
            'created_at' => '2025-01-10 23:43:13',
            'updated_at' => '2025-01-10 23:43:13'
        ],
        [
            'id' => 31,
            'department_id' => 7,
            'course' => 'STEM',
            'created_at' => '2025-01-10 23:43:19',
            'updated_at' => '2025-01-10 23:43:19'
        ],
        [
            'id' => 32,
            'department_id' => 7,
            'course' => 'ICT',
            'created_at' => '2025-01-10 23:43:24',
            'updated_at' => '2025-01-10 23:43:24'
        ]
      ];
      foreach ($courses as $course) {
        try {
          $c = new Courses($course);
          $c->create(True);
          $did = $course['department_id'];
          $cname = $course['course'];
          Logger::write_info("Default Course {$cname} of {$did} has been created.");
        } catch (\Throwable $e) {
          Logger::write_error("Failed to create default course: {$e->getMessage()}");
        }
      }
    }
  }
}
