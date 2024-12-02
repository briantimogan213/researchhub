<?php

declare(strict_types=1);

namespace Smcc\ResearchHub;

use Smcc\ResearchHub\Controllers\ApiController;
use Smcc\ResearchHub\Controllers\FileController;
use Smcc\ResearchHub\Controllers\NotificationController;
use Smcc\ResearchHub\Controllers\ViewController;
use Smcc\ResearchHub\Router\Router;
use Smcc\ResearchHub\Router\Session;

// initialize session_id for session tracking
Session::index();

/* STATIC FOLDERS */
Router::STATIC('/jsx', REACT_DIST_PATH, 'js');

/* GET METHOD */
Router::GET('/', [ViewController::class, 'home']);
Router::GET('/login', [ViewController::class, 'studentLogin']);
Router::GET('/admin/login', [ViewController::class, 'adminLogin']);
Router::GET('/signup', [ViewController::class, 'studentSignup']);
Router::GET('/teacher/login', [ViewController::class, 'teacherLogin']);
Router::GET('/admin', [ViewController::class, 'redirectAdmin']);
Router::GET('/admin/dashboard', [ViewController::class, 'adminDashboard']);
Router::GET('/admin/theses', [ViewController::class, 'adminThesisList']);
Router::GET('/admin/journal', [ViewController::class, 'adminJournalList']);
Router::GET('/admin/departments', [ViewController::class, 'adminDepartmentList']);
Router::GET('/admin/recent', [ViewController::class, 'adminRecentThesisDeployed']);
Router::GET('/admin/downloads', [ViewController::class, 'adminDownloads']);
Router::GET('/admin/students', [ViewController::class, 'adminStudentList']);
Router::GET('/admin/teachers', [ViewController::class, 'adminTeacherAccounts']);
Router::GET('/admin/homepage', [ViewController::class, 'adminHomepage']);
Router::GET('/admin/settings', [ViewController::class, 'adminSettings']);
Router::GET('/thesis', [ViewController::class, 'thesis']);
Router::GET('/journal', [ViewController::class, 'journal']);
Router::GET('/downloads', [ViewController::class, 'downloads']);
Router::GET('/about', [ViewController::class, 'aboutUs']);
Router::GET('/library', [ViewController::class, 'library']);
Router::GET('/read/thesis', [FileController::class, 'viewPdfFile']);
Router::GET('/read/journal', [FileController::class, 'viewPdfFile']);
Router::GET('/download/downloadable', [FileController::class, 'downloadFile']);
Router::GET('/settings', [ViewController::class, 'accountSettings']);
Router::GET('/logs', [ViewController::class, 'logs']);

/* API GET METHOD */
Router::GET('/api/test', [ApiController::class, 'test']); // test api route
Router::GET('/api/student', [ApiController::class, 'studentInfo']);
Router::GET('/api/thesis/all', [ApiController::class, 'thesisList']);
Router::GET('/api/journal/all', [ApiController::class, 'journalList']);
Router::GET('/api/thesis/public/all', [ApiController::class, 'allPublicTheses']);
Router::GET('/api/journal/public/all', [ApiController::class, 'allPublicJournal']);
Router::GET('/api/dashboard/statistics', [ApiController::class, 'dashboardStatistics']);
Router::GET('/api/logs', [NotificationController::class, 'logs']);
Router::GET('/api/student/all', [ApiController::class,'allStudents']);
Router::GET('/api/teacher/all', [ApiController::class,'allPersonnels']);
Router::GET('/api/favorites/all', [ApiController::class,'allFavorites']);
Router::GET('/api/downloadables/all', [ApiController::class,'allDownloadables']);
Router::GET('/api/downloadables/available', callable: [ApiController::class,'allAvaiableDownloadables']);
Router::GET('/api/home/announcements', [ApiController::class, 'homeAnnouncements']);
Router::GET('/api/home/most-views', [ApiController::class, 'homeMostViews']);

/* POST METHOD */
Router::POST('/logout', [ApiController::class, 'logout']);
Router::POST('/api/login', [ApiController::class, 'login']);
Router::POST('/api/signup', [ApiController::class, 'signup']);
Router::POST('/api/update', [ApiController::class, 'update']);
Router::POST('/api/upload/pdf', [FileController::class, 'uploadDocument']);
Router::POST('/api/upload/images', [FileController::class, 'uploadImages']);
Router::POST('/api/upload/file', [FileController::class, 'uploadFile']);
Router::POST('/api/thesis/publish', [ApiController::class, 'publishThesis']);
Router::POST('/api/journal/publish', [ApiController::class, 'publishJournal']);
Router::POST('/api/thesis/markfavorite', [ApiController::class, 'thesisMarkFavorite']);
Router::POST('/api/journal/markfavorite', [ApiController::class, 'journalMarkFavorite']);
Router::POST('/api/downloadables/publish', [ApiController::class, 'publishDownloadables']);
Router::POST('/api/home/announcement/edit', [ApiController::class, 'editHomeAnnouncement']);
Router::POST('/api/home/announcement/add', [ApiController::class, 'addHomeAnnouncement']);
/* PUT METHOD */

/* PATCH METHOD */

/* DELETE METHOD */
Router::DELETE('/api/thesis/delete', [ApiController::class, 'deleteThesis']);
Router::DELETE('/api/journal/delete', [ApiController::class, 'deleteJournal']);
Router::DELETE('/api/student/delete', [ApiController::class, 'deleteStudent']);
Router::DELETE('/api/teacher/delete', [ApiController::class, 'deletePersonnel']);
Router::DELETE('/api/downloadables/delete', [ApiController::class, 'deleteDownloadable']);
Router::DELETE('/api/home/announcement/delete', [ApiController::class, 'deleteHomeAnnouncement']);

/* ERROR PAGES */
Router::NOTFOUND([ViewController::class, 'notFound']);
Router::ERROR([ViewController::class, 'error']);
