<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

use Exception;
use Smcc\ResearchHub\Logger\Logger;
use Smcc\ResearchHub\Views\Global\View;

class Router
{
  private string $method;
  private string $uri;
  private array $query;
  private array $body;
  private array $files;

  static $Router__routes = [
    'NOT_FOUND_PAGE' => null,
    'ERROR_PAGE' => null,
  ];

  public function __construct()
  {
    $this->method = $_SERVER['REQUEST_METHOD'];
    $this->uri = self::getUriPath();
    $this->query = json_decode(json_encode($_GET), true);

    $contentType = $_SERVER['CONTENT_TYPE'] ?? 'Not Set';

    if (str_starts_with($contentType, 'application/json')) {
      $rawData = file_get_contents('php://input');
      $this->body = json_decode($rawData, true);
    } else {
      $this->body = $this->method !== 'GET' ? [...$_POST] : [];
    }
    $this->files = [];
    if ($this->method === 'POST') {
      foreach ($_FILES as $name => $file) {
        $this->files[$name] = new File($file);
      }
    }
  }

  public function request(string $uriPath, string $method, callable|array $callable): void
  {
    try {
      // Request Method: GET, POST, PUT, PATCH, DELETE
      if (
        $this->method === $method
        && $this->uri === $uriPath
      ) {
        $route = $callable;
        if (is_array($route) && count($route) === 2) {
          $class = $route[0];
          $method = $route[1];
          // Create an instance of the class
          $instance = new $class();
          if (method_exists($class, $method)) {
            $response = call_user_func([$instance, $method], new Request($this->method, $this->uri, $this->query, $this->body, $this->files, getallheaders()));
            if ($response instanceof Response) {
              $response->sendResponse(); // response ends here
            } else if ($response instanceof View) {
              $response->render(); // response ends here
            }
            Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 200)");
            exit; // if it is a view, exit here
          }
        } else if (is_callable($route)) {
          $response = call_user_func($route, new Request($this->method, $this->uri, $this->query, $this->body, $this->files, getallheaders()));
          if ($response instanceof Response) {
            $response->sendResponse(); // response ends here
          } else if ($response instanceof View) {
            $response->render();
          }
          Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 200)");
          exit; // if it is a view, exit here
        } else {
          $uri = $this->uri;
          throw new Exception("Invalid route configuration for route: {$uri}");
        }
      }
    } catch (\Throwable $e) {
      // 500 Error
      header('HTTP/1.1 500 Internal Server Error');
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 500)");
      Logger::write_error("Internal Server Error - " . $e->getMessage() . "\n" . $e->getTraceAsString());
      $errorPage = Router::$Router__routes['ERROR_PAGE'];
      if (is_array($errorPage)) {
        $class = $errorPage[0];
        $method = $errorPage[1];
        // Create an instance of the class
        $instance = new $class();
        if (method_exists($class, $method)) {
          $view = call_user_func([$instance, $method], "Internal Server Error - " . str_replace("\n", "<br />", $e->getMessage() . "\n" . $e->getTraceAsString()));
          if ($view instanceof Response) {
            $view->sendResponse();
          } else if ($view instanceof View) {
            $view->render();
          }
          exit;
        }
      } else if ($errorPage !== null && is_callable($errorPage)) {
        call_user_func($errorPage, "Internal Server Error - " . str_replace("\n", "<br />", $e->getMessage() . "\n" . $e->getTraceAsString()));
      }
      // default error page
      echo 'Error 500 Internal Server Error';
      exit;
    }
  }

  private function pageNotFound(callable|array $callable) {
    try {
        // 404 Not Found
      header('HTTP/1.1 404 Not Found');
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 404)");
      $notFoundPage = $callable;
      if (is_array($notFoundPage)) {
        // 404 Not Found page exists
        $class = $notFoundPage[0];
        $method = $notFoundPage[1];
        // Create an instance of the class
        $instance = new $class();
        if (method_exists($class, $method)) {
          $view = call_user_func([$instance, $method]);
          if ($view instanceof Response) {
            $view->sendResponse();
          } else if ($view instanceof View) {
            $view->render();
          }
          exit;
        }
      } else {
        // 404 Not Found page exists
        if ($notFoundPage !== null && is_callable($notFoundPage)) {
          call_user_func($notFoundPage);
          exit;
        }
      }
      // default not found page
      echo 'Error 404 Not Found';
      exit;
    } catch (\Throwable $e) {
      // 500 Error
      header('HTTP/1.1 500 Internal Server Error');
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 500)");
      Logger::write_error("Internal Server Error - " . $e->getMessage() . "\n" . $e->getTraceAsString());
      $errorPage = Router::$Router__routes['ERROR_PAGE'];
      if (is_array($errorPage)) {
        $class = $errorPage[0];
        $method = $errorPage[1];
        // Create an instance of the class
        $instance = new $class();
        if (method_exists($class, $method)) {
          $view = call_user_func([$instance, $method], "Internal Server Error - " . str_replace("\n", "<br />", $e->getMessage() . "\n" . $e->getTraceAsString()));
          if ($view instanceof Response) {
            $view->sendResponse();
          } else if ($view instanceof View) {
            $view->render();
          }
          exit;
        }
      } else if ($errorPage !== null && is_callable($errorPage)) {
        call_user_func($errorPage, "Internal Server Error - " . str_replace("\n", "<br />", $e->getMessage() . "\n" . $e->getTraceAsString()));
      }
      // default error page
      echo 'Error 500 Internal Server Error';
      exit;
    }
  }


  public static function getPathname(string $pathname) {
    return URI_PREFIX ? (str_starts_with(URI_PREFIX, "/")
      ? URI_PREFIX . $pathname
      : "/" . URI_PREFIX . $pathname)
    : $pathname;
  }

  public static function getUriPath()
  {
    // trim the URI_PREFIX from the $this->uri
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $prefix = URI_PREFIX ? (str_starts_with(URI_PREFIX, "/") ? URI_PREFIX : "/" . URI_PREFIX) : false;
    return $prefix ? str_replace($prefix, '', $uri) : $uri;
  }

  public static function publicAssets(): void
  {
    $filePath = implode(DIRECTORY_SEPARATOR, [ASSETS_PATH, substr(self::getUriPath(), 1)]);
    if (file_exists($filePath) && is_file($filePath) && is_readable($filePath)) {
      $lastModified = gmdate('D, d M Y H:i:s', filemtime($filePath)) . ' GMT';
      if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] === $lastModified) {
        header('HTTP/1.1 304 Not Modified');
        Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 304)");
        exit;
      }
      $_splitted_ext = explode('.', strtolower($filePath));
      $ContentType = MIMETYPES['.' . array_pop($_splitted_ext)] . "; charset=utf-8";
      $_headerContentType = "Content-Type: $ContentType";
      header($_headerContentType);
      // header('HTTP/1.1 200 OK');
      header("Last-Modified: $lastModified");
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 200)");
      readfile($filePath);
      exit;
    }
  }

  private function staticPage(string $diskPath, int $offset, ?string $ignoreExtension): void
  {
    $filePath = implode(DIRECTORY_SEPARATOR, [$diskPath, substr($this->uri, $offset + 1)]);
    $info = pathinfo($filePath);
    if (empty($info['extension'])) {
      // no file extension
      // then try adding $ignoreExtension to the end of the path
      if (!empty($ignoreExtension)) {
        $filePath .= ".{$ignoreExtension}";
      }
    }
    if (file_exists($filePath) && is_file($filePath) && is_readable($filePath)) {
      $lastModified = gmdate('D, d M Y H:i:s', filemtime($filePath)) . ' GMT';
      if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && $_SERVER['HTTP_IF_MODIFIED_SINCE'] === $lastModified) {
        header('HTTP/1.1 304 Not Modified');
        Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 304)");
        exit;
      }
      $_splitted_ext = explode('.', strtolower($filePath));
      $ContentType = MIMETYPES['.' . array_pop($_splitted_ext)] . "; charset=utf-8";
      $_headerContentType = "Content-Type: $ContentType";
      header($_headerContentType);
      // header('HTTP/1.1 200 OK');
      header("Last-Modified: $lastModified");
      Logger::write_info("{$_SERVER['REQUEST_URI']} (HTTP Response: 200)");
      readfile($filePath);
      exit;
    }
  }
  public function GET(string $uriPath, callable|array $callable): void
  {
    $this->request($uriPath, "GET", $callable);
  }
  public function POST(string $uriPath, callable|array $callable): void
  {
    $this->request($uriPath, "POST", callable: $callable);
  }
  public function PUT(string $uriPath, callable|array $callable): void
  {
    $this->request($uriPath, "PUT", callable: $callable);
  }
  public function PATCH(string $uriPath, callable|array $callable): void
  {
    $this->request($uriPath, "PATCH", callable: $callable);
  }
  public function DELETE(string $uriPath, callable|array $callable): void
  {
    $this->request($uriPath, "DELETE", callable: $callable);
  }
  public function STATIC(string $uriPath, string $diskPath, ?string $ignoreExtension = null): void
  {
    // check static files
    $matchingPath = str_starts_with($this->uri, $uriPath);
    if ($matchingPath) {
        // static folder found
      $this->staticPage($diskPath, strlen($uriPath), $ignoreExtension);
    }
  }

  public function NOTFOUND(callable|array $callable): void
  {
    $this->pageNotFound($callable);
  }

  public static function ERROR(callable|array $callable): void
  {
    try {
      Router::$Router__routes['ERROR_PAGE'] = $callable;
    } catch (\Throwable $e) {
      die("ERROR: " . $e->getMessage());
    }
  }
}
