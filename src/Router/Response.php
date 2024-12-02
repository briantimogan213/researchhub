<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

use Smcc\ResearchHub\Logger\Logger;

enum StatusCode: int
{
  case OK = 200;
  case CREATED = 201;
  case ACCEPTED = 202;
  case NO_CONTENT = 204;
  case MOVED_PERMANENTLY = 301;
  case FOUND = 302;
  case NOT_MODIFIED = 304;
  case BAD_REQUEST = 400;
  case UNAUTHORIZED = 401;
  case FORBIDDEN = 403;
  case NOT_FOUND = 404;
  case METHOD_NOT_ALLOWED = 405;
  case CONFLICT = 409;
  case GONE = 410;
  case LENGTH_REQUIRED = 411;
  case PRECONDITION_FAILED = 412;
  case PAYLOAD_TOO_LARGE = 413;
  case REQUEST_URI_TOO_LONG = 414;
  case UNSUPPORTED_MEDIA = 415;
  case REQUESTED_RANGE_NOT_SATISFIABLE = 416;
  case EXPECTATION_FAILED = 417;
  case UNPROCESSABLE_ENTITY = 422;
  case TOO_MANY_REQUESTS = 429;
  case REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
  case UNAVAILABLE_FOR_LEGAL_REASONS = 451;
  case INTERNAL_SERVER_ERROR = 500;
  case NOT_IMPLEMENTED = 501;
  case SERVICE_UNAVAILABLE = 503;
  case GATEWAY_TIMEOUT = 504;
  case HTTP_VERSION_NOT_SUPPORTED = 505;
}

enum ResponseSendType
{
  case JSON;
  case TEXT;
  case FILE;
  case BLOB;
  case REDIRECT;
  case STREAM;
}

class Response
{
  private array $headers;
  private StatusCode $statusCode;
  private ResponseSendType $sendType;
  private string $content;
  private array $streamData;
  private mixed $callback;
  private int $interval;

  public function __construct(array $headers, StatusCode $statusCode = StatusCode::OK, ResponseSendType $sendType = ResponseSendType::TEXT, string $content = '', array $streamData = [], ?callable $onStream = null, int $interval = 5)
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
    $contentType = match ($this->sendType) {
      ResponseSendType::JSON => 'application/json; charset=utf-8',
      ResponseSendType::TEXT => 'text/plain; charset=utf-8',
      ResponseSendType::FILE => $this->getMimeType($this->content) . '; charset=utf-8',
      ResponseSendType::BLOB => 'application/octet-stream; charset=utf-8',
      ResponseSendType::REDIRECT => 'text/plain; charset=utf-8',
      ResponseSendType::STREAM => 'text/event-stream',
    };
    header("Content-Type: $contentType");
    foreach ($this->headers as $key => $value) {
      header("$key: $value");
    }
    if ($this->sendType !== ResponseSendType::STREAM) {
      http_response_code($this->statusCode->value);
    if ($this->sendType === ResponseSendType::FILE) {
        readfile($this->content);
      } else {
        echo $this->content;
      }
      if ($_SERVER['REQUEST_URI'] !== '/api/logs') {
        Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: {$this->statusCode->value})");
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
            function(mixed $data) {
              echo "data: " . json_encode($data) . "\n\n";
              ob_flush();
              flush();
            },
            $streamData,
            function (string $key, mixed $value) use ($streamData) {
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

  public static function json(array $data, StatusCode $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::JSON, json_encode($data));
  }

  public static function text(string $content, StatusCode $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::TEXT, $content);
  }

  public static function file(string $filePath, StatusCode $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::FILE, $filePath);
  }

  public static function blob(string $content, StatusCode $statusCode = StatusCode::OK, array $headers = []): Response
  {
    return new self($headers, $statusCode, ResponseSendType::BLOB, $content);
  }

  public static function redirect(string $url, StatusCode $statusCode = StatusCode::FOUND): Response
  {
    return new self([], $statusCode, ResponseSendType::REDIRECT, Router::getPathname($url));
  }

  public static function stream(callable $onStream, array $args = [], int $interval = 5, StatusCode $statusCode = StatusCode::FOUND): Response
  {
    return new self([], $statusCode, ResponseSendType::STREAM, '', $args, $onStream, $interval);
  }
}
