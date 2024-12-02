<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Global;

use Smcc\ResearchHub\Router\Router;

class Head
{
  static public function default(string $title)
  {
?>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" href="<?= Router::getPathname("/favicon.ico") ?>" type="image/x-icon"/>
      <title><?= $title . " - " . APP_TITLE; ?></title>

      <!-- Google font -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Quicksand:wght@300..700&Helvetica:wght@300..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />

      <!-- Google icons -->
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

      <!-- Tailwind Minified CSS -->
      <link type="text/css" rel="stylesheet" href="<?= Router::getPathname('/css/style.css') ?>" />
      <link type="text/css" rel="stylesheet" href="<?= Router::getPathname('/css/main.min.css') ?>" />
      <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.3.1",
            "react-dom": "https://esm.sh/react-dom@18.3.1/client",
            "react-dom/server": "https://esm.sh/react-dom@18.3.1/server",
            "@yudiel/react-qr-scanner": "https://esm.sh/@yudiel/react-qr-scanner@2.0.4",
            "clsx": "https://esm.sh/clsx@2.1.1",
            "react-pdf": "https://esm.sh/react-pdf@9.1.0",
            "react-player": "https://esm.sh/react-player@2.16.0",
            "react-player/youtube": "https://esm.sh/react-player@2.16.0/youtube",
            "sweetalert2": "https://esm.sh/sweetalert2@11.12.4",
            "sanitize-html": "https://esm.sh/sanitize-html@2.13.1"
          }
        }
      </script>
    </head>
<?php
  }
}