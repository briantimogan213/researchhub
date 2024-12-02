<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Controllers;

use Smcc\ResearchHub\Logger\Logger;
use Smcc\ResearchHub\Router\Response;

class NotificationController extends Controller
{

  public function logs(): Response
  {
    $logContents = Logger::read_log_file();
    return Response::json(["data" => $logContents]);
  }
}