<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

class Cookies
{
  public static function get(string $name): ?string
  {
    return $_COOKIE[$name] ?? null;
  }
  public static function has(string $name): bool
  {
    return isset($_COOKIE[$name]);
  }
  public static function set(string $name, string $value, ?int $expiry = 3600, ?string $path = '/'): string
  {
    setcookie($name, $value, [
      'expires' => time() + $expiry, // Expiration time
      'path' => $path, // Path on the server where the cookie will be available
      'secure' => true, // Cookie should only be sent over secure (HTTPS) connections
      'httponly' => true, // Cookie is accessible only through the HTTP protocol, not JavaScript
      'samesite' => 'Strict' // Controls whether the cookie is sent with cross-site requests
    ]);
    return $value;
  }
  public static function delete(string $name, ?string $path = '/'): void
  {
    self::set($name, '', time() - 1, $path);
  }
}
