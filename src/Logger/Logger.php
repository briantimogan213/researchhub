<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Logger;

class Logger
{
  static public function write_error(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER ERROR] [$timestamp] $message";
    error_log($txt, 3, "php://stderr");
    error_log($txt . PHP_EOL, 3, LOGGER_FILE_PATH);
  }
  static public function write_warning(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER WARNING] [$timestamp] $message";
    error_log($txt);
    error_log($txt . PHP_EOL, 3, LOGGER_FILE_PATH);
  }
  static public function write_info(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER INFO] [$timestamp] $message";
    error_log($txt);
    error_log($txt . PHP_EOL, 3, LOGGER_FILE_PATH);
  }
  static public function write_debug(string $message)
  {
    if ($_ENV['PHP_ENV'] === 'development') {
      $timestamp = date('Y-m-d H:i:s');
      $txt = "[USER DEBUG] [$timestamp] $message";
      error_log($txt);
      error_log($txt . PHP_EOL, 3, LOGGER_FILE_PATH);
    }
  }

  static public function read_log_file() {
    if (file_exists(LOGGER_FILE_PATH)) {
      return file_get_contents(LOGGER_FILE_PATH);
    }
  }
}