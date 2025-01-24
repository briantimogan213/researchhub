<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Views\Global;

interface ViewBase {
  public function render(): void;
  public function getTitle(): string;
  public function getData(): array;
  public function getReactAppPath(): string;
  public static function view(string $view, array $data = [], string $reactAppPath = ""): static;
}

class View implements ViewBase {

  private string $title;
  private array $data;
  private string $reactAppPath;

  public function __construct(string $title, array $data = [], string $reactAppPath = "")
  {
    $this->title = $title;
    $this->data = $data;
    $this->reactAppPath = $reactAppPath;
  }

  /**
   * @inheritDoc
   */
  public function render(): void
  {
    // default rendering logic goes here
    echo "Edit your render method in ". static::class. " class to implement the desired rendering logic.\n";
  }
  /**
   * @inheritDoc
   */
  public function getData(): array {
    return $this->data;
  }
  /**
   * @inheritDoc
   */
  public function getTitle(): string {
    return $this->title;
  }
  /**
   * @inheritDoc
   */
  public function getReactAppPath(): string {
    return $this->reactAppPath;
  }
  /**
   * @inheritDoc
   */
  public static function view(string $view, array $data = [], string $reactAppPath = ""): static
  {
    return new static($view, $data, $reactAppPath);
  }
}