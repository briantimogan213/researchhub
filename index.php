<?php

declare(strict_types=1);


define('APP_PATH', realpath(__DIR__ . '/.'));

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'vendor', 'autoload.php']);

function handleFatalError()
{
    $error = error_get_last();
    if ($error !== null) {
      $controller = new \Smcc\ResearchHub\Controllers\ViewController();
      $view = $controller->error("Fatal Error - " . str_replace("\n", "<br />", $error['message']) . " <br />File: {$error['file']} <br />Line: {$error['line']}");
      $view->render();
      exit;
    }
}

register_shutdown_function('handleFatalError');

set_error_handler(function($severity, $message, $file, $line) {
  if ($severity === E_ERROR || $severity === E_USER_ERROR) {
    $controller = new \Smcc\ResearchHub\Controllers\ViewController();
    $view = $controller->error("Internal Server Error - " . str_replace("\n", "<br />", $message) . " <br />File: $file <br />Line: $line <br />", debug_backtrace());
    $view->render();
    exit;
  }
});

$dotenv = \Dotenv\Dotenv::createImmutable(APP_PATH, '.env.production');
$dotenv->load();

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'compatibility.php']);
require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'define.php']);
require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'bootstrap.php']);