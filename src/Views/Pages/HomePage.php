<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Pages;

use Smcc\ResearchHub\Views\Global\Template;
use Smcc\ResearchHub\Views\Global\View;

class HomePage extends View
{
  public function render(): void
  {
    Template::defaultWithNav(
      $this->getTitle(),
      function () {
?>
  <div class="relative max-w-screen">
    <aside class="relative mx-auto mt-3 lg:mt-0 mb-1 lg:mb-3 lg:mx-0 lg:absolute lg:left-2 lg:top-4 min-w-full md:min-w-[400px] max-w-[500px] p-1 lg:p-3" id="most-view-container-theses"></aside>
    <!-- <aside class="relative mx-auto mt-3 lg:mt-0 mb-1 lg:mb-3 lg:mx-0 lg:absolute lg:left-2 lg:top-4 min-w-full md:min-w-[400px] max-w-[500px] p-1 lg:p-3" id="most-view-container-journals"></aside> -->
    <div class="flex-grow max-w-[600px] mx-auto">
      <div class="mx-auto flex flex-col justify-center items-center text-center mt-1 mb-4 lg:mt-8 lg:mb-8 p-4">
        <h1 class="text-[22px] md:text-[28px] lg:text-[32px] font-[Poppins] font-[600] lg:leading-[72px] text-[#16507B]">Where Knowledge Meets Innovation</h1>
      </div>
    </div>
  </div>
  <div class="mt-2">
    &nbsp;
  </div>
  <div class="relative min-h-[150px]">
    <div class="flex flex-col justify-center items-center my-10 gap-y-8 p-2" id="home-announcement-container">
      <div class="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  </div>
  <div class="mt-2">
    &nbsp;
  </div>
  <script>
    window.sessionStorage.setItem('authenticated', <?= count($this->getData()) > 0 && $this->getData()['authenticated'] ? "true" : "false" ?>);
  </script>
<?php
      },
      $this->getData(),
      $this->getReactAppPath()
    );
  }
}