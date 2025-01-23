<?php

declare(strict_types=1);

if (!function_exists('getallheaders')) {
  function getallheaders() {
    $headers = [];
    foreach ($_SERVER as $name => $value) {
      if (str_starts_with($name, 'HTTP_')) {
        $headerName = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($name, 5)))));
        $headers[$headerName] = $value;
      }
    }
    return $headers;
  }
}

try {
  \Smcc\ResearchHub\Routes::init();
} catch (\Throwable $e) {
  header("Content-Type: application/json");
  die(json_encode(["error" => $e->getMessage(), "trace" => $e->getTrace()]));
}