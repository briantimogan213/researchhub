<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

use Exception;
use Smcc\ResearchHub\Logger\Logger;
use Smcc\ResearchHub\Models\Admin;
use Smcc\ResearchHub\Models\AdminLogs;
use Smcc\ResearchHub\Models\Database;
use Smcc\ResearchHub\Models\PersonnelLogs;
use Smcc\ResearchHub\Models\Session as SessionModel;
use Smcc\ResearchHub\Models\StudentLogs;
use Smcc\ResearchHub\Views\Pages\Error500Page;

class Session
{
  public static function index(): void
  {
    try {
      $db = Database::getInstance();
      $cookieSession = Cookies::get('session_id');
      if (!$cookieSession) {
        Logger::write_debug("No session cookie found");
        $cookieSession = Cookies::set('session_id', bin2hex(random_bytes(16)), 60 * 60 * 8);
        // Initialize session data to database
        $session = new SessionModel(['session_id' => $cookieSession, 'ip_address' => self::getClientIpAddress(), 'user_agent' => self::getClientAgent()]);
        $session->create();
        Logger::write_info("New session created: session_id={$cookieSession}");
      } else {
        Logger::write_debug("Session cookie found");
        $session = $db->fetchOne(SessionModel::class, ['session_id' => $cookieSession, 'ip_address' => self::getClientIpAddress(), 'user_agent' => self::getClientAgent()]);
        if (!$session) {
          Logger::write_debug("Session not found in the database");
          unset($_SESSION['auth']);
          // decode JWT token to get user id and expiration time
          Cookies::delete('session_id');
        }
      }
      // seed an admin account if not exists
      Admin::seed();
    } catch (\Throwable $e) {
      Logger::write_error("Failed to initialize session: ". $e->getMessage());
      new Error500Page('Internal Server Error', ["message" => $e->getMessage() . "\n" . $e->getTraceAsString()]);
    }
  }

  public static function getSession(): ?array
  {
    return self::isAuthenticated() ? $_SESSION['auth'] : null;
  }

  public static function isAuthenticated(): bool
  {
    // Check cookies for session_id and validate it with the database
    $session_cookie = Cookies::get('session_id');
    if (!$session_cookie) {
      unset($_SESSION['auth']);
      return false;
    }
    // Validate session_id in the database
    $db = Database::getInstance();
    $session = $db->fetchOne(SessionModel::class, ['session_id' => $session_cookie]);
    if ($session && $session->token !== null) {
      // decode JWT token to get user id and expiration time
      $payload = JWT::decode($session->token);
      if ($payload && $payload['id'] === $session->session_id && $payload['exp'] > time()) {
        $_SESSION['auth'] = json_encode($payload['data']);
        return true;
      }
      $session->delete();
      Cookies::delete('session_id');
      Logger::write_debug("Session expired or invalid: session_id={$session_cookie}");
    }
    unset($_SESSION['auth']);
    return false;
  }

  public static function create(string $account, mixed $id, string $full_name): bool
  {
    $db = Database::getInstance();
    Logger::write_debug("creating jwt token for");
    $token = JWT::encode([
      'account' => $account,
      'id' => $id,
      'full_name' => $full_name
    ]);
    Logger::write_debug("token created");
    $cookie_session = Cookies::get('session_id');
    Logger::write_debug("session_id from cookie");
    if (!$cookie_session) {
      $cookie_session = bin2hex(random_bytes(16));
      Cookies::set('session_id', $cookie_session, 60 * 60 * 8);
    }
    Logger::write_debug("Updating session in database");
    $session = $db->fetchOne(SessionModel::class, ['session_id' => $cookie_session, 'ip_address' => self::getClientIpAddress(), 'user_agent' => self::getClientAgent()]);
    if (!$session) {
      try {
        $session = new SessionModel(['session_id' => $cookie_session, 'token' => $token, 'ip_address' => self::getClientIpAddress(), 'user_agent' => self::getClientAgent()]);
        $session->create();
      } catch (\PDOException $e) {
        Logger::write_debug("Session Expired. Refresh the page and try again.\n". $e->getMessage());
        throw new Exception("Session Expired. Please refresh the page.");
      }
    } else {
      $session->token = $token;
      sleep(1);
      $session->update();
      Logger::write_debug("Updated session in database");
    }
    $ipadd = self::getClientIpAddress();
    $ua = self::getClientAgent();
    Logger::write_info("User authorized for: account={$account}, id={$id}, full_name={$full_name}, ip_address={$ipadd}, user_agent={$ua}");
    return self::isAuthenticated();
  }

  public static function getUserFullName(): ?string
  {
    return self::isAuthenticated() ? json_decode($_SESSION['auth'], true)['full_name'] : null;
  }

  public static function getUserId(): string|int|null
  {
    return self::isAuthenticated() ? json_decode($_SESSION['auth'], true)['id'] : null;
  }

  public static function getUserAccountType(): ?string
  {
    return self::isAuthenticated() ? json_decode($_SESSION['auth'], true)['account'] : null;
  }

  public static function logout(): void
  {
    $session_cookie = Cookies::get('session_id');
    if ($session_cookie) {
      $db = Database::getInstance();
      $session = $db->fetchOne(SessionModel::class, ['session_id' => $session_cookie]);
      $accountType = self::getUserAccountType();
      $fullName = self::getUserFullName();
      $uid = self::getUserId();
      $ipAddr = self::getClientIpAddress();
      $accType = ucfirst($accountType);
      $session->delete();
      Cookies::delete('session_id');
      Logger::write_debug("$accType ID {$uid} logged out: session_id={$session_cookie} name={$fullName} IP: {$ipAddr}");
      switch ($accountType) {
        case 'admin':
          (new AdminLogs(['admin_id' => $uid, 'activity' => "$accType ID {$uid} has Logged out at {$ipAddr}"]))->create();
          break;
        case 'personnel':
          (new PersonnelLogs(['personnel_id' => $uid, 'activity' => "$accType ID {$uid} has Logged out at {$ipAddr}"]))->create();
          break;
        case'student':
          (new StudentLogs(['student_id' => $uid, 'activity' => "$accType ID {$uid} has Logged out at {$ipAddr}"]))->create();
          break;
      }
    }
    unset($_SESSION['auth']);
  }

  public static function getClientIpAddress()
  {
    Logger::write_debug("GETTING IP");
    try {
      // Check for the forwarded IP address from proxies
      if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
          // Check if the IP is from a shared internet
          $ip = $_SERVER['HTTP_CLIENT_IP'];
      } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
          // Check if the IP is passed from a proxy
          $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      } else {
          // Default to the remote address
          $ip = $_SERVER['REMOTE_ADDR'];
      }
      $clientIp = filter_var($ip, FILTER_VALIDATE_IP);
      Logger::write_debug("Client IP address: {$clientIp}");
      return $clientIp;
    } catch (\Throwable $e) {
      Logger::write_error("Error retrieving client IP address: {$e->getMessage()}");
    }
    return '';
  }

  public static function getClientAgent(): string
  {
    Logger::write_debug("GETTING USER AGENT");
    return $_SERVER['HTTP_USER_AGENT'];
  }
}
