<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

use Smcc\ResearchHub\Logger\Logger;

interface FileInterface
{
  public function getName(): string;
  public function getFullPath(): string;
  public function getType(): string;
  public function getSize(): int;
  public function getTmpName(): string;
  public function getExtension(): string;
  public function getError(): int;
  public function moveTo(string $path, string $filename): bool;
  public function getDestinationPath(): string;
  public function getDestinationFilename(): string;
  public function getDestination(): string;
}

class File implements FileInterface
{
  private string $name;
  private string $fullPath;
  private string $type;
  private int $size;
  private string $tmpName;
  private int $error;
  private string $destinationPath;
  private string $destinationFilename;

  public function __construct(array $file)
  {
    $this->name = $file['name'];
    $this->fullPath = $file['tmp_name'];
    $this->type = $file['type'];
    $this->size = $file['size'];
    $this->tmpName = $file['tmp_name'];
    $this->error = $file['error'];
  }

  /**
   * @inheritDoc
   */
  public function getError(): int
  {
    return $this->error;
  }

  /**
   * @inheritDoc
   */
  public function getFullPath(): string
  {
    return $this->fullPath;
  }

  /**
   * @inheritDoc
   */
  public function getName(): string
  {
    return $this->name;
  }

  /**
   * @inheritDoc
   */
  public function getSize(): int
  {
    return $this->size;
  }

  /**
   * @inheritDoc
   */
  public function getTmpName(): string
  {
    return $this->tmpName;
  }

  /**
   * @inheritDoc
   */
  public function getType(): string
  {
    return $this->type;
  }

  /**
   * @inheritDoc
   */
  public function moveTo(string $path, string $filename): bool
  {
    $this->destinationPath = $path;
    $this->destinationFilename = $filename . $this->getExtension();
    $destination = implode(DIRECTORY_SEPARATOR, [$this->destinationPath, $this->destinationFilename]);
    return move_uploaded_file($this->tmpName, $destination);
  }

  /**
   * @inheritDoc
   */
  public function getDestinationFilename(): string
  {
    return $this->destinationFilename;
  }

  /**
   * @inheritDoc
   */
  public function getDestinationPath(): string
  {
    return $this->destinationPath;
  }
  /**
   * @inheritDoc
   */
  public function getDestination(): string
  {
    return implode(DIRECTORY_SEPARATOR, [$this->destinationPath, $this->destinationFilename]);
  }
  /**
   * @inheritDoc
   */
  public function getExtension(): string
  {
    return array_search($this->type, MIMETYPES, true) ?: '';
  }
}
