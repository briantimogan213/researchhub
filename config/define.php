<?php

declare(strict_types=1);

define('APP_TITLE', $_ENV['APP_TITLE'] ?? 'SMCC Research Hub');
define('URI_PREFIX', $_ENV['URI_PREFIX'] ?? "");

define('MYSQL_HOST', $_ENV['MYSQL_HOST'] ?? 'localhost');
define('MYSQL_PORT', $_ENV['MYSQL_POST'] ?? '3306');
define('MYSQL_DATABASE', $_ENV['MYSQL_DATABASE'] ?? 'researchhub');
define('MYSQL_USER', $_ENV['MYSQL_USER'] ?? 'smcc');
define('MYSQL_PASSWORD', $_ENV['MYSQL_PASSWORD'] ?? 'smccMySql');

define('ASSETS_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'public']));
define('VIEW_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'src', 'Views']));
define('MODELS_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'src', 'Models']));
define('REACT_SRC_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'src', 'Views', 'react', 'src']));
define('REACT_DIST_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'src', 'Views', 'react', 'dist']));
define('UPLOADS_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, 'uploads']));
define('LOGGER_FILE_PATH', implode(DIRECTORY_SEPARATOR, [APP_PATH, "uploads", "mylogs.log"]));

define('MAX_IMAGE_SIZE', 10 * 1024 * 1024); // 10 MB
define('JWT_SECRET_KEY', $_ENV['JWT_SECRET_KEY'] ?? 'researchhub_secret_key');

// set DISPLAY_ERRORS to false if in production environment to hide error messages
define('DISPLAY_ERRORS', $_ENV['DISPLAY_ERRORS'] ?? true);

define('MIMETYPES', value: [
  '' => 'application/octet-stream',
  '.txt' => 'text/plain',
  '.jpg' => 'image/jpeg',
  '.png' => 'image/png',
  '.gif' => 'image/gif',
  '.pdf' => 'application/pdf',
  '.css' => 'text/css',
  '.ico' => 'image/x-icon',
  '.svg' => 'image/svg+xml',
  '.html' => 'text/html',
  '.php' => 'text/html',
  '.js' => 'application/javascript',
  '.mjs' => 'application/javascript',
  '.ts' => 'application/javascript',
  '.tsx' => 'application/javascript',
  '.jsx' => 'application/javascript',
  '.zip' => 'application/zip',
  '.docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.csv' => 'text/csv',
  '.odt' => 'application/vnd.oasis.opendocument.text',
  '.ods' => 'application/vnd.oasis.opendocument.spreadsheet',
  '.pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.ppt' => 'application/vnd.ms-powerpoint',
  '.rtf' => 'application/rtf',
  '.eot' => 'application/vnd.ms-fontobject',
  '.ttf' => 'application/x-font-ttf',
  '.woff' => 'application/font-woff',
  '.woff2' => 'application/font-woff2',
  '.json' => 'application/json',
  '.mp4' => 'video/mp4',
  '.mp3' => 'audio/mpeg',
  '.wav' => 'audio/wav',
  '.avi' => 'video/x-msvideo',
  '.mov' => 'video/quicktime',
  '.flv' => 'video/x-flv',
  '.m4a' => 'audio/mp4',
  '.m4v' => 'video/x-m4v',
  '.ogv' => 'video/ogg',
  '.webm' => 'video/webm',
  '.3gp' => 'video/3gpp',
  '.mkv' => 'video/x-matroska',
  '.wmv' => 'video/x-ms-wmv',
  '.asf' => 'video/x-ms-asf',
  '.mpg' => 'video/mpeg',
  '.m2v' => 'video/mpeg',
  '.mng' => 'video/x-mng',
  '.mpe' => 'video/mpeg',
  '.qt' => 'video/quicktime',
  '.lsf' => 'video/x-la-asf',
  '.ls' => 'video/x-la-asf',
  '.ram' => 'audio/x-pn-realaudio',
  '.rm' => 'application/vnd.rn-realmedia',
  '.rpm' => 'audio/x-pn-realaudio-plugin',
  '.ra' => 'audio/x-realaudio',
  '.cda' => 'audio/x-cda',
  '.mid' => 'audio/midi',
  '.kar' => 'audio/midi',
  '.m3u' => 'audio/x-mpegurl',
  '.oga' => 'audio/ogg',
  '.spx' => 'audio/ogg',
  '.ogg' => 'audio/ogg',
  '.weba' => 'audio/webm',
  '.flac' => 'audio/flac',
  '.ape' => 'audio/x-ape',
  '.m4b' => 'audio/mp4',
  '.aac' => 'audio/aac',
  '.aiff' => 'audio/x-aiff',
  '.aif' => 'audio/x-aiff',
]);
