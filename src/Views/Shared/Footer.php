<?php

namespace Smcc\ResearchHub\Views\Shared;

use Smcc\ResearchHub\Router\Router;
use Smcc\ResearchHub\Router\Session;

class Footer {
  public static function default() {
?>
  <footer class="font-[Roboto] font-[400] text-[16px] leading-[22.4px] w-full min-h-[100px] max-w-full mb-4 md:mb-0 grid grid-cols-1 md:grid-cols-2 gap-y-2 items-center justify-end">
    <div class="flex text-center items-center justify-center">
      &copy; 2024 Saint Michael College of Caraga
    </div>
    <ul class="flex flex-wrap md:flex-nowrap max-w-full justify-center gap-x-4 gap-y-2 md:justify-end md:gap-y-2 md:gap-x-8 items-center px-8 md:max-w-[700px]">
      <!-- <li>
        <a href="<?= Router::getPathname("/about") ?>">About</a>
      </li> -->
      <?php if (Session::getUserAccountType() === "admin"): ?>
        <li>
          <a href="<?= Router::getPathname("/admin/login") ?>">Admin</a>
        </li>
      <?php endif ?>
    </div>
  </footer>
<?php
  }

  public static function admin() {
  ?>
    <footer class="bg-[#F3F7FD] text-black font-[Roboto] font-[400] text-[16px] leading-[22.4px] w-full max-w-full min-h-[100px] mb-4 md:mb-0 grid grid-cols-1 md:grid-cols-2 gap-y-2 items-center justify-end">
      <div class="flex text-center items-center justify-center">
        &copy; 2024 Saint Michael College of Caraga
      </div>
      <ul class="flex flex-wrap md:flex-nowrap max-w-full justify-center gap-x-4 gap-y-2 md:justify-end md:gap-y-2 md:gap-x-8 items-center px-8 md:max-w-[700px]">
      </div>
    </footer>
  <?php
  }
}