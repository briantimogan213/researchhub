<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages;

use Smcc\ResearchHub\Views\Shared\Template;
use Smcc\ResearchHub\Views\Shared\View;

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