<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages;

use Smcc\ResearchHub\Views\Global\Template;
use Smcc\ResearchHub\Views\Global\View;

class AdminPages extends View
{
  public function render(): void
  {
    Template::reactWithSidebar(
      $this->getTitle(),
      $this->getReactAppPath(),
      $this->getData(),
      [
        [
          'label' => 'Dashboard',
          'url' => '/admin/dashboard',
        ],
        [
          'label' => 'Thesis List',
          'url' => '/admin/theses',
        ],
        [
          'label' => 'Journal List',
          'url' => '/admin/journal',
        ],
        [
          'label' => 'Upload Downloadables',
          'url' => '/admin/downloads',
        ],
        [
          'label' => 'Teacher Accounts',
          'url' => '/admin/teachers',
        ],
        [
          'label' => 'Announcement',
          'url' => '/admin/homepage',
        ],
        [
          'label' => 'Manage Departments',
          'url' => '/admin/departments',
        ],
      ]
    );
  }
}