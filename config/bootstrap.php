<?php

declare(strict_types=1);

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'config', 'define.php']);

foreach (scandir(dirname(__FILE__)) as $dirName) {
  $pathName = implode(DIRECTORY_SEPARATOR, [dirname(__FILE__), $dirName]);
  if (empty(pathinfo($pathName)['extension']) && is_dir($pathName)) {
    foreach (scandir($pathName) as $dirOrFile) {
      $myPath = implode(DIRECTORY_SEPARATOR, [$pathName, $dirOrFile]);
      if (".." !== $dirOrFile && "." !== $dirOrFile) {
        if (!empty(pathinfo($pathName)['extension']) && pathinfo($pathName)['extension'] === "php" && is_file($myPath)) {
          require_once $myPath;
        } else if (empty(pathinfo($myPath)['extension']) && is_dir($myPath)) {
          foreach (scandir($myPath) as $dirOrFile2) {
            $myPath2 = implode(DIRECTORY_SEPARATOR, [$myPath, $dirOrFile2]);
            if (".." !== $dirOrFile2 && "." !== $dirOrFile2) {
              if (!empty(pathinfo($myPath2)['extension']) && pathinfo($myPath2)['extension'] === "php" && is_file($myPath2)) {
                require_once $myPath2;
              } else if (empty(pathinfo($myPath2)['extension']) && is_dir($myPath2)) {
                foreach (scandir($myPath2) as $dirOrFile3) {
                  $myPath3 = implode(DIRECTORY_SEPARATOR, [$myPath2, $dirOrFile3]);
                  if (".." !== $dirOrFile3 && "." !== $dirOrFile3) {
                    if (!empty(pathinfo($myPath3)['extension']) && pathinfo($myPath3)['extension'] === "php" && is_file($myPath3)) {
                      require_once $myPath3;
                    } else if (empty(pathinfo($myPath3)['extension']) && is_dir($myPath3)) {
                      foreach (scandir($myPath3) as $dirOrFile4) {
                        $myPath4 = implode(DIRECTORY_SEPARATOR, [$myPath3, $dirOrFile4]);
                        if (".." !== $dirOrFile4 && "." !== $dirOrFile4) {
                          if (!empty(pathinfo($myPath4)['extension']) && pathinfo($myPath4)['extension'] === "php" && is_file($myPath4)) {
                            require_once $myPath4;
                          } else if (empty(pathinfo($myPath4)['extension']) && is_dir($myPath4)) {
                            foreach (scandir($myPath4) as $dirOrFile5) {
                              $myPath5 = implode(DIRECTORY_SEPARATOR, [$myPath4, $dirOrFile5]);
                              if (".." !== $dirOrFile5 && "." !== $dirOrFile5) {
                                if (!empty(pathinfo($myPath5)['extension']) && pathinfo($myPath5)['extension'] === "php" && is_file($myPath5)) {
                                  require_once $myPath5;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

require_once implode(DIRECTORY_SEPARATOR, [APP_PATH, 'src', 'routes.php']);

$app = new \Smcc\ResearchHub\Router\Router();

$app->run();
