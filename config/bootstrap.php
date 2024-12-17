<?php

declare(strict_types=1);
try {
  \Smcc\ResearchHub\routes::init();
} catch (\Exception $e) {
  die("WHAT?" . $e->getMessage());
}
