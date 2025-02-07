<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages;

use Smcc\ResearchHub\Views\Shared\Template;
use Smcc\ResearchHub\Views\Shared\View;

class UserPages extends View
{
  public function render(): void
  {
    Template::reactWithNav(
      $this->getTitle(),
      $this->getReactAppPath(),
      $this->getData(),
    );
  }
}