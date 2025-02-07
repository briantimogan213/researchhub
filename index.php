<?php

declare(strict_types=1);


define('APP_PATH', realpath(__DIR__ . '/.'));

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'vendor', 'autoload.php']);

set_error_handler(function($severity, $message, $file, $line) {
  if ($severity === E_ERROR || $severity === E_USER_ERROR) {
    $controller = new \Smcc\ResearchHub\Controllers\ViewController();
    $view = $controller->error("Internal Server Error - " . str_replace("\n", "<br />", $message) . " | File: $file | Line: $line |", debug_backtrace());
    $view->render();
    exit;
  }
});

$dotenv = \Dotenv\Dotenv::createImmutable(APP_PATH, '.env.production');
$dotenv->load();

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'compatibility.php']);
require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'define.php']);
require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'bootstrap.php']);