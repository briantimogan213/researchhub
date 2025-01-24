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
use Smcc\ResearchHub\Views\Global\View;
use Smcc\ResearchHub\Views\Pages\AdminPages;
use Smcc\ResearchHub\Views\Pages\ReactPages;
use Smcc\ResearchHub\Views\Pages\Error400Page;
use Smcc\ResearchHub\Views\Pages\Error500Page;
use Smcc\ResearchHub\Views\Pages\HomePage;
use Smcc\ResearchHub\Views\Pages\UserPages;

class ViewController extends Controller
{
  public function root(): View|Response
  {
    if (Session::isAuthenticated()) {
      if (Session::getUserAccountType() === "admin") {
        return Response::redirect("/admin/dashboard");
      }
      return Response::redirect("/home");
    }
    return ReactPages::view("Welcome", [], "root");
  }
  public function home(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return HomePage::view("Home", $data, "home");
  }

  public function guestLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Guest Login", [], 'guest/login');
  }

  public function adminLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      if (Session::getUserAccountType() === "admin") {
        return Response::redirect("/admin/dashboard");
      }
      return Response::redirect("/home");
    }
    return ReactPages::view("Admin Login", [], 'admin/login');
  }

  public function studentLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Student Login", [], 'student/login');
  }

  public function teacherLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    return ReactPages::view("Teacher Login", [], 'teacher/login');
  }

  public function guestSignup(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/home");
    }
    $data = ['authenticated' => Session::isAuthenticated()];
    return ReactPages::view("Guest Registration", $data, 'guest/signup');
  }

  public function studentSignup(): View|Response
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

  public function adminDashboard(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Admin Dashboard", [], 'admin/dashboard');
  }

  public function adminThesisList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Thesis List - Admin", [], 'admin/theses');
  }

  public function adminJournalList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Journal List - Admin", [], 'admin/journal');
  }

  public function adminPrintThesis(): View|Response
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

  public function adminPrintJournal(): View|Response
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

  public function adminDepartmentList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Department List - Admin", [], 'admin/departments');
  }

  public function adminHomepage(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Manage Homepage - Admin", [], 'admin/homepage');
  }

  public function adminDownloads(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Downloads - Admin", [], 'admin/downloads');
  }

  public function adminStudentList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Student List - Admin", [], 'admin/students');
  }

  public function adminTeacherAccounts(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Teacher Accounts - Admin", [], 'admin/teachers');
  }

  public function adminGuestAccounts(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Guest Accounts - Admin", [], 'admin/guests');
  }

  public function manageDepartments(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Manage Departments - Admin", [], 'admin/departments');
  }

  public function thesis(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Thesis/Capstone", $data,'main/thesis');
  }

  public function journal(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Journal", $data,'main/journal');
  }

  public function downloads(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Downloads", $data, 'main/downloads');
  }

  public function aboutUs(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("About Us", $data,'main/about');
  }

  public function library(): View|Response
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Library", $data,'main/library');
  }

  public function adminSettings(): View|Response
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

  public function accountSettings(): View|Response
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
  public function error($message): View
  {
    return Error500Page::view("Error 500 - {$this->head_title}", ["message" => $message]);
  }

  public function logs(): View
  {
    return ReactPages::view("Logs", [], "logs");
  }
}
