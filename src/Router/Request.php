<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

interface RequestInterface {
  public function getMethod(): string;
  public function getUri(): string;
  public function getUriSegments(): array;
  public function getUriSegment(int $index): ?string;
  public function getQueryParam(string $key): string;
  public function getQuery(): array;
  public function getBody(): array;
  public function getBodyParam(string $key): mixed;
  public function getFiles(string $key): array|File|null;
  public function getAllFiles(): array;
  public function getHeaders(): array;
}

class Request implements RequestInterface {
  private string $method;
  private string $uri;
  private array $query;
  private array $body;
  private array $files;
  private array $headers;
  public function __construct(string $method, string $uri, array $query = [], array $body = [], array $files = [], array $headers = [])
  {
    $this->method = $method;
    $this->uri = $uri;
    $this->query = $query;
    $this->body = $body;
    $this->files = $files;
    $this->headers = $headers;
  }
  public function getMethod(): string {
    return $this->method;
  }
  public function getUri(): string {
    return $this->uri;
  }
  public function getUriSegments(): array {
    return explode('/', trim($this->uri,'/'));
  }
  public function getUriSegment(int $index): ?string {
    $segments = $this->getUriSegments();
    return count($segments) < $index && $index > -1 ? $segments[$index] : null;
  }
  public function getQuery(): array {
    return $this->query;
  }
  public function getBody(): array {
    return $this->body;
  }
  public function getBodyParam(string $key): mixed {
    return $this->body[$key] ?? null;
  }
  public function getFiles(string $key): array|File|null {
    return $this->files[$key] ?? null;
  }
  public function getAllFiles(): array {
    return $this->files;
  }
  public function getHeaders(): array {
    return $this->headers;
  }

  public function getQueryParam(string $key): string {
    return $this->query[$key] ?? "";
  }
}