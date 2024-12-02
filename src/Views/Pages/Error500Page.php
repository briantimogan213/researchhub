<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages;

use Smcc\ResearchHub\Router\Router;
use Smcc\ResearchHub\Views\Global\Template;
use Smcc\ResearchHub\Views\Global\View;

class Error500Page extends View
{
  public function render(): void
  {
    Template::default(
      $this->getTitle(),
      function ($data = []) {
      ?>
        <div id="notfound">
          <div class="notfound">
            <div class="notfound-404 error-500" style="background-image: url('<?= Router::getPathname("/images/error-icon.png") ?>');"></div>
            <h1>500</h1>
            <h2>Oops! Something went wrong</h2>
            <p>An error occured. Please try again later.</p>
            <?php if (DISPLAY_ERRORS) { ?>
              <p class="error-message">
                <?= $data['message']; ?>
              </p>
            <?php } ?>
            <a href="<?= Router::getPathname("/") ?>">Back to homepage</a>
          </div>
        </div>
      <?php
      },
      $this->getData()
    );
  }
}
