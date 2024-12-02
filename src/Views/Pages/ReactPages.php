<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages\Admin;

use Smcc\ResearchHub\Views\Global\Template;
use Smcc\ResearchHub\Views\Global\View;

class ReactPages extends View
{
  public function render(): void
  {
    Template::react(
      $this->getTitle(),
      $this->getReactAppPath(),
      $this->getData()
    );
  }
}