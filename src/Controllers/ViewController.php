<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Controllers;

use Smcc\ResearchHub\Models\Admin;
use Smcc\ResearchHub\Models\Database;
use Smcc\ResearchHub\Models\Guest;
use Smcc\ResearchHub\Models\Journal;
use Smcc\ResearchHub\Models\Personnel;
use Smcc\ResearchHub\Models\Student;
use Smcc\ResearchHub\Models\Thesis;
use Smcc\ResearchHub\Router\Response;
use Smcc\ResearchHub\Router\Session;
use Smcc\ResearchHub\Views\Shared\View;
use Smcc\ResearchHub\Views\Pages\AdminPages;
use Smcc\ResearchHub\Views\Pages\ReactPages;
use Smcc\ResearchHub\Views\Pages\Error400Page;
use Smcc\ResearchHub\Views\Pages\Error500Page;
use Smcc\ResearchHub\Views\Pages\HomePage;
use Smcc\ResearchHub\Views\Pages\UserPages;
use Smcc\ResearchHub\Logger\Logger;

class ViewController extends Controller
{
  /**
   * @return View|Response
   */
  public function root()
  {
    if (Session::isAuthenticated()) {
      if (Session::getUserAccountType() === "admin") {
        return Response::redirect("/admin/dashboard");
      }
      return Response::redirect("/home");
    }
    return ReactPages::view("Welcome", [], "root");
  }
  /**
   * @return View|Response
   */
  public function home()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return HomePage::view("Home", $data, "home");
  }

  /**
   * @return View|Response
   */
  public function guestLogin()
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Guest Login", [], 'guest/login');
  }

  /**
   * @return View|Response
   */
  public function adminLogin()
  {
    if (Session::isAuthenticated()) {
      if (Session::getUserAccountType() === "admin") {
        return Response::redirect("/admin/dashboard");
      }
      return Response::redirect("/home");
    }
    return ReactPages::view("Admin Login", [], 'admin/login');
  }

  /**
   * @return View|Response
   */
  public function studentLogin()
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Student Login", [], 'student/login');
  }

  /**
   * @return View|Response
   */
  public function teacherLogin()
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Teacher Login", [], 'teacher/login');
  }

  /**
   * @return View|Response
   */
  public function guestSignup()
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    $data = ['authenticated' => Session::isAuthenticated()];
    return ReactPages::view("Guest Registration", $data, 'guest/signup');
  }

  /**
   * @return View|Response
   */
  public function studentSignup()
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    $data = ['authenticated' => Session::isAuthenticated()];
    return ReactPages::view("Student Registration", $data, 'student/signup');
  }

  public function redirectAdmin(): Response
  {
    if (Session::isAuthenticated() && Session::getUserAccountType() === "admin") {
      return Response::redirect("/admin/dashboard");
    }
    return Response::redirect("/admin/login");
  }

  /**
   * @return View|Response
   */
  public function adminDashboard()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Admin Dashboard", [], 'admin/dashboard');
  }

  /**
   * @return View|Response
   */
  public function adminThesisList()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Thesis List - Admin", [], 'admin/theses');
  }

  /**
   * @return View|Response
   */
  public function adminJournalList()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Journal List - Admin", [], 'admin/journal');
  }

  /**
   * @return View|Response
   */
  public function adminPrintThesis()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    $db = Database::getInstance();
    $thesis = $db->getAllRows(Thesis::class);
    return ReactPages::view("Print Theses/Capstones", [
      'thesis' => [...array_map(fn(Thesis $th) => $th->toArray(true), $thesis)],
    ], 'print/page');
  }

  /**
   * @return View|Response
   */
  public function adminPrintJournal()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    $db = Database::getInstance();
    $journal = $db->getAllRows(Journal::class);
    return ReactPages::view("Print Journals", [
      'journal' => [...array_map(fn(Journal $jn): array => $jn->toArray(true), $journal)],
    ], 'print/page');
  }

  /**
   * @return View|Response
   */
  public function adminDepartmentList()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Department List - Admin", [], 'admin/departments');
  }

  /**
   * @return View|Response
   */
  public function adminHomepage()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Manage Homepage - Admin", [], 'admin/homepage');
  }

  /**
   * @return View|Response
   */
  public function adminDownloads()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Downloads - Admin", [], 'admin/downloads');
  }

  /**
   * @return View|Response
   */
  public function adminStudentList()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Student List - Admin", [], 'admin/students');
  }

  /**
   * @return View|Response
   */
  public function adminTeacherAccounts()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Teacher Accounts - Admin", [], 'admin/teachers');
  }

  /**
   * @return View|Response
   */
  public function adminGuestAccounts()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Guest Accounts - Admin", [], 'admin/guests');
  }

  /**
   * @return View|Response
   */
  public function manageDepartments()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Manage Departments - Admin", [], 'admin/departments');
  }

  /**
   * @return View|Response
   */
  public function thesis()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Thesis/Capstone", $data,'main/thesis');
  }

  /**
   * @return View|Response
   */
  public function journal()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Journal", $data,'main/journal');
  }

  /**
   * @return View|Response
   */
  public function downloads()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Downloads", $data, 'main/downloads');
  }

  /**
   * @return View|Response
   */
  public function aboutUs()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("About Us", $data,'main/about');
  }

  /**
   * @return View|Response
   */
  public function library()
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Library", $data,'main/library');
  }

  /**
   * @return View|Response
   */
  public function adminSettings()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    $db = Database::getInstance();
    $admin = $db->getRowById(Admin::class, Session::getUserId());
    $authData = $admin->toArray();
    $authData['account'] = Session::getUserAccountType();
    unset($authData['password']); // remove password for security reasons
    unset($authData['created_at']); // remove created
    unset($authData['updated_at']); // remove updated
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return AdminPages::view("Account Settings", $data, 'settings');
  }

  /**
   * @return View|Response
   */
  public function accountSettings()
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() === "admin") {
      return Response::redirect("/");
    }
    $account = Session::getUserAccountType();
    $db = Database::getInstance();
    $user = $db->getRowById($account === 'student' ? Student::class : ($account === 'guest' ? Guest::class : Personnel::class), Session::getUserId());
    $authData = $user->toArray();
    $authData['account'] = $account;
    unset($authData['password']); // remove password for security reasons
    unset($authData['created_at']); // remove created
    unset($authData['updated_at']); // remove updated
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Account Settings", $data, 'settings');
  }

  public function notFound(): View
  {
    try {
      return Error400Page::view("Page not found - {$this->head_title}");
    } catch (\Exception $e) {
      die("ERROR?: " . $e->getMessage());
    }
  }
  public function error($message, $trace = []): View
  {
    Logger::write_error("Error 500 - {$this->head_title}: {$message}");
    Logger::write_error("Trace Error: " . json_encode($trace, JSON_PRETTY_PRINT));
    return Error500Page::view("Error 500 - {$this->head_title}", ["message" => $message]);
  }

  public function logs(): View
  {
    return ReactPages::view("Logs", [], "logs");
  }
}
