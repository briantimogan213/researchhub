<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Controllers;

use Smcc\ResearchHub\Models\Admin;
use Smcc\ResearchHub\Models\Database;
use Smcc\ResearchHub\Models\Personnel;
use Smcc\ResearchHub\Models\Student;
use Smcc\ResearchHub\Router\Response;
use Smcc\ResearchHub\Router\Session;
use Smcc\ResearchHub\Views\Global\View;
use Smcc\ResearchHub\Views\Pages\Admin\AdminPages;
use Smcc\ResearchHub\Views\Pages\Admin\ReactPages;
use Smcc\ResearchHub\Views\Pages\Error400Page;
use Smcc\ResearchHub\Views\Pages\Error500Page;
use Smcc\ResearchHub\Views\Pages\HomePage;
use Smcc\ResearchHub\Views\Pages\UserPages;

class ViewController extends Controller
{

  public function home(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return HomePage::view("Home", $data, "/jsx/home");
  }

  public function adminLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      if (Session::getUserAccountType() === "admin") {
        return Response::redirect("/admin/dashboard");
      }
      return Response::redirect("/");
    }
    return ReactPages::view("Admin Login", [], '/jsx/admin/login');
  }

  public function studentLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/");
    }
    return ReactPages::view("Student Login", [], '/jsx/student/login');
  }

  public function teacherLogin(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/");
    }
    return ReactPages::view("Teacher Login", [], '/jsx/teacher/login');
  }

  public function studentSignup(): View|Response
  {
    if (Session::isAuthenticated()) {
      return Response::redirect("/");
    }
    $data = ['authenticated' => Session::isAuthenticated()];
    return ReactPages::view("Student Registration", $data, '/jsx/student/signup');
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
    return AdminPages::view("Admin Dashboard", [], '/jsx/admin/dashboard');
  }

  public function adminThesisList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Thesis List - Admin", [], '/jsx/admin/theses');
  }

  public function adminJournalList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Journal List - Admin", [], '/jsx/admin/journal');
  }

  public function adminDepartmentList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Department List - Admin", [], '/jsx/admin/departments');
  }

  public function adminRecentThesisDeployed(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Recently Published - Admin", [], '/jsx/admin/recent');
  }

  public function adminHomepage(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Manage Homepage - Admin", [], '/jsx/admin/homepage');
  }

  public function adminDownloads(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Downloads - Admin", [], '/jsx/admin/downloads');
  }

  public function adminStudentList(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Student List - Admin", [], '/jsx/admin/students');
  }

  public function adminTeacherAccounts(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() !== "admin") {
      return Response::redirect("/admin/login");
    }
    return AdminPages::view("Teacher Accounts - Admin", [], '/jsx/admin/teachers');
  }

  public function thesis(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Thesis/Capstone", $data,'/jsx/main/thesis');
  }

  public function journal(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Journal", $data,'/jsx/main/journal');
  }

  public function downloads(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Downloads", $data, '/jsx/main/downloads');
  }

  public function aboutUs(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("About Us", $data,'/jsx/main/about');
  }

  public function library(): View
  {
    $authData = Session::isAuthenticated() ? [
      'account' => Session::getUserAccountType(),
      'full_name' => Session::getUserFullName(),
      'id' => Session::getUserId(),
    ] : [];
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Library", $data,'/jsx/main/library');
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
    return AdminPages::view("Account Settings", $data, '/jsx/admin/settings');
  }

  public function accountSettings(): View|Response
  {
    if (!Session::isAuthenticated() || Session::getUserAccountType() === "admin") {
      return Response::redirect("/");
    }
    $account = Session::getUserAccountType();
    $db = Database::getInstance();
    $user = $db->getRowById($account === 'student' ? Student::class : Personnel::class, Session::getUserId());
    $authData = $user->toArray();
    $authData['account'] = $account;
    unset($authData['password']); // remove password for security reasons
    unset($authData['created_at']); // remove created
    unset($authData['updated_at']); // remove updated
    $data = ['authenticated' => Session::isAuthenticated(), 'authData' => $authData];
    return UserPages::view("Account Settings", $data, '/jsx/main/settings');
  }

  public function notFound(): View
  {
    return Error400Page::view("Page not found - {$this->head_title}");
  }
  public function error($message): View
  {
    return Error500Page::view("Error 500 - {$this->head_title}", ["message" => $message]);
  }

  public function logs(): View
  {
    return ReactPages::view("Logs", [], "/jsx/logs");
  }
}
