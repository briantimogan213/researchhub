<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

function getMimeTypeFromContent(string $content): string
{
  $extension = strtolower(pathinfo($content, PATHINFO_EXTENSION));
  return MIMETYPES[".$extension"] ?? 'application/octet-stream';
}


class ResponseSendType
{
  const JSON = 'json';
  const TEXT = 'text';
  const FILE = 'file';
  const BLOB = 'blob';
  const REDIRECT = 'redirect';
  const STREAM = 'stream';
}



function get_content_type_from_send_type($sendType, $content) {
  switch ($sendType) {
    case ResponseSendType::JSON:
      return 'application/json; charset=utf-8';
    case ResponseSendType::TEXT:
      return'text/plain; charset=utf-8';
    case ResponseSendType::FILE:
      return getMimeTypeFromContent($content) . '; charset=utf-8';
    case ResponseSendType::BLOB:
      return 'application/octet-stream; charset=utf-8';
    case ResponseSendType::REDIRECT:
      return 'text/plain; charset=utf-8';
    case ResponseSendType::STREAM:
      return 'text/event-stream';
  }
}