<?php

declare(strict_types=1);

namespace Smcc\ResearchHub;

use Smcc\ResearchHub\Controllers\ApiController;
use Smcc\ResearchHub\Controllers\FileController;
use Smcc\ResearchHub\Controllers\NotificationController;
use Smcc\ResearchHub\Controllers\ViewController;
use Smcc\ResearchHub\Router\Response;
use Smcc\ResearchHub\Router\Router;
use Smcc\ResearchHub\Router\Session;

class Routes {
  public static function init(): void {
    // load assets first to avoid problems with loading
    Router::publicAssets();

    // initialize session_id for session tracking
    Session::index();

    Router::ERROR([ViewController::class, 'error']);

    $app = new Router();

    /* STATIC FOLDERS */
    // $app->STATIC('/jsx', REACT_DIST_PATH);

    /* GET METHOD */
    $app->GET('/', fn() => Response::redirect("/home"));
    $app->GET('/home', [ViewController::class, 'home']);
    $app->GET('/login', [ViewController::class, 'root']);
    $app->GET('/guest/signup', [ViewController::class, 'guestSignup']);
    $app->GET('/guest/login', [ViewController::class, 'guestLogin']);
    $app->GET('/student/signup', [ViewController::class, 'studentSignup']);
    $app->GET('/student/login', [ViewController::class, 'studentLogin']);
    $app->GET('/admin/login', [ViewController::class, 'adminLogin']);
    $app->GET('/teacher/login', [ViewController::class, 'teacherLogin']);
    $app->GET('/admin', [ViewController::class, 'redirectAdmin']);
    $app->GET('/admin/dashboard', [ViewController::class, 'adminDashboard']);
    $app->GET('/admin/theses', [ViewController::class, 'adminThesisList']);
    $app->GET('/admin/journal', [ViewController::class, 'adminJournalList']);
    $app->GET('/admin/departments', [ViewController::class, 'adminDepartmentList']);
    $app->GET('/admin/recent', [ViewController::class, 'adminRecentThesisDeployed']);
    $app->GET('/admin/downloads', [ViewController::class, 'adminDownloads']);
    $app->GET('/admin/students', [ViewController::class, 'adminStudentList']);
    $app->GET('/admin/teachers', [ViewController::class, 'adminTeacherAccounts']);
    $app->GET('/admin/guests', [ViewController::class, 'adminGuestAccounts']);
    $app->GET('/admin/homepage', [ViewController::class, 'adminHomepage']);
    $app->GET('/admin/departments', [ViewController::class, 'manageDepartments']);
    $app->GET('/admin/settings', [ViewController::class, 'adminSettings']);
    $app->GET('/thesis', [ViewController::class, 'thesis']);
    $app->GET('/journal', [ViewController::class, 'journal']);
    $app->GET('/downloads', [ViewController::class, 'downloads']);
    $app->GET('/about', [ViewController::class, 'aboutUs']);
    $app->GET('/library', [ViewController::class, 'library']);
    $app->GET('/read/thesis', [FileController::class, 'viewPdfFile']);
    $app->GET('/read/journal', [FileController::class, 'viewPdfFile']);
    $app->GET('/download/downloadable', [FileController::class, 'downloadFile']);
    $app->GET('/settings', [ViewController::class, 'accountSettings']);
    $app->GET('/logs', [ViewController::class, 'logs']);
    $app->GET('/admin/print/theses', [ViewController::class, 'adminPrintThesis']);
    $app->GET('/admin/print/journals', [ViewController::class, 'adminPrintJournal']);

    /* API GET METHOD */
    $app->GET('/api/test', [ApiController::class, 'test']); // test api route
    $app->GET('/api/student', [ApiController::class, 'studentInfo']);
    $app->GET('/api/thesis/all', [ApiController::class, 'thesisList']);
    $app->GET('/api/journal/all', [ApiController::class, 'journalList']);
    $app->GET('/api/thesis/public/all', [ApiController::class, 'allPublicTheses']);
    $app->GET('/api/journal/public/all', [ApiController::class, 'allPublicJournal']);
    $app->GET('/api/dashboard/statistics', [ApiController::class, 'dashboardStatistics']);
    $app->GET('/api/logs', [NotificationController::class, 'logs']);
    $app->GET('/api/student/all', [ApiController::class,'allStudents']);
    $app->GET('/api/teacher/all', [ApiController::class,'allPersonnels']);
    $app->GET('/api/guest/all', [ApiController::class,'allGuests']);
    $app->GET('/api/favorites/all', [ApiController::class,'allFavorites']);
    $app->GET('/api/downloadables/all', [ApiController::class,'allDownloadables']);
    $app->GET('/api/downloadables/available', [ApiController::class,'allAvaiableDownloadables']);
    $app->GET('/api/home/announcements', [ApiController::class, 'homeAnnouncements']);
    $app->GET('/api/home/most-views', [ApiController::class, 'homeMostViews']);
    $app->GET('/api/departments', [ApiController::class, 'allDepartments']);

    /* POST METHOD */
    $app->POST('/logout', [ApiController::class, 'logout']);
    $app->POST('/api/login', [ApiController::class, 'login']);
    $app->POST('/api/signup', [ApiController::class, 'signup']);
    $app->POST('/api/update', [ApiController::class, 'update']);
    $app->POST('/api/upload/pdf', [FileController::class, 'uploadDocument']);
    $app->POST('/api/upload/images', [FileController::class, 'uploadImages']);
    $app->POST('/api/upload/file', [FileController::class, 'uploadFile']);
    $app->POST('/api/thesis/publish', [ApiController::class, 'publishThesis']);
    $app->POST('/api/journal/publish', [ApiController::class, 'publishJournal']);
    $app->POST('/api/thesis/markfavorite', [ApiController::class, 'thesisMarkFavorite']);
    $app->POST('/api/journal/markfavorite', [ApiController::class, 'journalMarkFavorite']);
    $app->POST('/api/downloadables/publish', [ApiController::class, 'publishDownloadables']);
    $app->POST('/api/home/announcement/edit', [ApiController::class, 'editHomeAnnouncement']);
    $app->POST('/api/home/announcement/add', [ApiController::class, 'addHomeAnnouncement']);
    $app->POST('/api/departments/add', [ApiController::class, 'addDepartment']);
    $app->POST('/api/departments/courses/add', [ApiController::class, 'addCourse']);
    $app->POST('/api/departments/edit', [ApiController::class,'editDepartment']);
    $app->POST('/api/departments/courses/edit', [ApiController::class, 'editDepartmentCourses']);

    /* PUT METHOD */

    /* PATCH METHOD */

    /* DELETE METHOD */
    $app->DELETE('/api/thesis/delete', [ApiController::class, 'deleteThesis']);
    $app->DELETE('/api/journal/delete', [ApiController::class, 'deleteJournal']);
    $app->DELETE('/api/student/delete', [ApiController::class, 'deleteStudent']);
    $app->DELETE('/api/teacher/delete', [ApiController::class, 'deletePersonnel']);
    $app->DELETE('/api/guest/delete', [ApiController::class, 'deleteGuest']);
    $app->DELETE('/api/downloadables/delete', [ApiController::class, 'deleteDownloadable']);
    $app->DELETE('/api/home/announcement/delete', [ApiController::class, 'deleteHomeAnnouncement']);
    $app->DELETE('/api/departments/delete', [ApiController::class, 'deleteDepartment']);

    /* NOT FOUND PAGE */
    $app->NOTFOUND([ViewController::class, 'notFound']);
  }
}