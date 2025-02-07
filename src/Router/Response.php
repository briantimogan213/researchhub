<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

use Smcc\ResearchHub\Logger\Logger;

class Response
{
  private array $headers;
  private int $statusCode;
  private string $sendType;
  private string $content;
  private array $streamData;
  private $callback;
  private int $interval;

  public function __construct(array $headers, int $statusCode = StatusCode::OK, string $sendType = ResponseSendType::TEXT, string $content = '', array $streamData = [], ?callable $onStream = null, int $interval = 5)
  {
    $this->headers = $headers;
    $this->statusCode = $statusCode;
    $this->sendType = $sendType;
    $this->content = $content;
    $this->callback = $onStream;
    $this->interval = $interval;
    $this->streamData = $streamData;
  }

  private function getMimeType(string $filePath): string
  {
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    return MIMETYPES[".$extension"] ?? 'application/octet-stream';
  }

  public function sendResponse(): void
  {
    if ($this->sendType === ResponseSendType::REDIRECT) {
      header("Location: {$this->content}");
      exit;
    }
    $contentType = get_content_type_from_send_type($this->sendType, $this->content);
    header("Content-Type: $contentType");
    foreach ($this->headers as $key => $value) {
      header("$key: $value");
    }
    if ($this->sendType !== ResponseSendType::STREAM) {
      http_response_code($this->statusCode);
    if ($this->sendType === ResponseSendType::FILE) {
        readfile($this->content);
      } else {
        echo $this->content;
      }
      if ($_SERVER['REQUEST_URI'] !== '/api/logs') {
        Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: {$this->statusCode})");
      }
      exit;
    } else {
      header('Cache-Control: no-cache');
      header('Connection: keep-alive');
      header('Access-Control-Allow-Origin: *');
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP STREAM STARTED)");
      $streamData = $this->streamData;
      while (true) {
        if (connection_aborted()) {
          break;
        }
        if (is_callable($this->callback)) {
          $called_to_exit = call_user_func(
            $this->callback,
            function($data) {
              echo "data: " . json_encode($data) . "\n\n";
              ob_flush();
              flush();
            },
            $streamData,
            function (string $key, $value) use ($streamData) {
              $streamData[$key] = $value;
              return $streamData;
            }
          );
          if ($called_to_exit) {
            break;
          }
        }
        sleep((int) $this->interval);
      }

      // http_response_code($this->statusCode->value);

      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP STREAM ENDED)");
      // Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: {$this->statusCode->value})");
      exit;
    }
  }

  public static function json(array $data, int $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::JSON, json_encode($data));
  }

  public static function text(string $content, int $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::TEXT, $content);
  }

  public static function file(string $filePath, int $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::FILE, $filePath);
  }

  public static function blob(string $content, int $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::BLOB, $content);
  }

  public static function redirect(string $url, int $statusCode = StatusCode::FOUND): Response
  {
    return new self([], $statusCode, ResponseSendType::REDIRECT, Router::getPathname($url));
  }

  public static function stream(callable $onStream, array $args = [], int $interval = 5, int $statusCode = StatusCode::FOUND): Response
  {
    return new self([], $statusCode, ResponseSendType::STREAM, '', $args, $onStream, $interval);
  }
}
