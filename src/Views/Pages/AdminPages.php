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
          'icon' => 'dashboard'
        ],
        [
          'label' => 'Thesis List',
          'url' => '/admin/theses',
          'icon' => 'tune'
        ],
        [
          'label' => 'Journal List',
          'url' => '/admin/journal',
          'icon' => 'tune'
        ],
        [
          'label' => 'Upload Downloadables',
          'url' => '/admin/downloads',
          'icon' => 'download'
        ],
        [
          'label' => 'Teacher Accounts',
          'url' => '/admin/teachers',
          'icon' => 'diversity_3'
        ],
        [
          'label' => 'Student Accounts',
          'url' => '/admin/students',
          'icon' => 'group'
        ],
        [
          'label' => 'Guest Accounts',
          'url' => '/admin/guests',
          'icon' => 'groups'
        ],
        [
          'label' => 'Announcement',
          'url' => '/admin/homepage',
          'icon' => 'home'
        ],
        [
          'label' => 'Manage Departments',
          'url' => '/admin/departments',
          'icon' => 'domain'
        ],
      ]
    );
  }
}