<?php

// Fallback for str_starts_with()
if (!function_exists('str_starts_with')) {
  function str_starts_with(string $haystack, string $needle): bool {
      return strpos($haystack, $needle) === 0;
  }
}

// Fallback for str_ends_with()
if (!function_exists('str_ends_with')) {
  function str_ends_with(string $haystack, string $needle): bool {
      return substr($haystack, -strlen($needle)) === $needle;
  }
}

// Fallback for array_is_list()
if (!function_exists('array_is_list')) {
  function array_is_list(array $array): bool {
      if (empty($array)) {
          return true;
      }
      return array_keys($array) === range(0, count($array) - 1);
  }
}

// Fallback for getallheaders()
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