<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Logger;

class Logger
{
  public static function write_error(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER   ERROR] [$timestamp] $message";
    file_put_contents(LOGGER_FILE_PATH, $txt . PHP_EOL, FILE_APPEND | LOCK_EX);
  }
  public static function write_warning(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER WARNING] [$timestamp] $message";
    file_put_contents(LOGGER_FILE_PATH, $txt . PHP_EOL, FILE_APPEND | LOCK_EX);
  }
  public static function write_info(string $message)
  {
    $timestamp = date('Y-m-d H:i:s');
    $txt = "[USER    INFO] [$timestamp] $message";
    file_put_contents(LOGGER_FILE_PATH, $txt . PHP_EOL, FILE_APPEND | LOCK_EX);
  }
  public static function write_debug(string $message)
  {
    if ($_ENV['PHP_ENV'] === 'development') {
      $timestamp = date('Y-m-d H:i:s');
      $txt = "[USER   DEBUG] [$timestamp] $message";
      file_put_contents(LOGGER_FILE_PATH, $txt . PHP_EOL, FILE_APPEND | LOCK_EX);
    }
  }

  public static function read_log_file() {
    if (file_exists(LOGGER_FILE_PATH)) {
      return file_get_contents(LOGGER_FILE_PATH);
    }
  }
}