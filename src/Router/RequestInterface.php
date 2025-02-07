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
  public function getBodyParam(string $key);
  /**
   * @return array|\Smcc\ResearchHub\Router\File|null
   */
  public function getFiles(string $key);
  public function getAllFiles(): array;
  public function getHeaders(): array;
}