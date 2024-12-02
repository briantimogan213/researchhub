<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Controllers;

interface BaseController
{
  public function notFound();
  public function error(string $message);
}

class Controller implements BaseController
{
  protected string $head_title = APP_TITLE ?? "Research Hub";
  /**
   * @inheritDoc
   */
  public function notFound()
  {
  }
  /**
   * @inheritDoc
   */
  public function error(string $message)
  {
  }
}
