<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Controllers;

use DateTime;
use Smcc\ResearchHub\Logger\Logger;
use Smcc\ResearchHub\Models\Admin;
use Smcc\ResearchHub\Models\AdminLogs;
use Smcc\ResearchHub\Models\Database;
use Smcc\ResearchHub\Models\Downloadables;
use Smcc\ResearchHub\Models\Journal;
use Smcc\ResearchHub\Models\JournalFavorites;
use Smcc\ResearchHub\Models\JournalPersonnelFavorites;
use Smcc\ResearchHub\Models\JournalPersonnelReads;
use Smcc\ResearchHub\Models\JournalReads;
use Smcc\ResearchHub\Models\Personnel;
use Smcc\ResearchHub\Models\PersonnelLogs;
use Smcc\ResearchHub\Models\Student;
use Smcc\ResearchHub\Models\StudentLogs;
use Smcc\ResearchHub\Models\Thesis;
use Smcc\ResearchHub\Models\ThesisFavorites;
use Smcc\ResearchHub\Models\ThesisPersonnelFavorites;
use Smcc\ResearchHub\Models\ThesisPersonnelReads;
use Smcc\ResearchHub\Models\ThesisReads;
use Smcc\ResearchHub\Router\Request;
use Smcc\ResearchHub\Router\Response;
use Smcc\ResearchHub\Router\Session as RouterSession;
use Smcc\ResearchHub\Router\StatusCode;

class ApiController extends Controller
{
  public function test(): Response
  {
    return Response::json(['message' => 'API Test Successful']);
  }

  public function homeAnnouncements(): Response
  {
    $filePath = implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, 'announcements', 'announcements.json']);
    if (!file_exists($filePath) ||!is_readable($filePath)) {
      return Response::json(['error' => 'Announcements not found'], StatusCode::NOT_FOUND);
    }
    $data = json_decode(file_get_contents($filePath), true);
    return Response::json(['success' => $data ?? []]);
  }

  public function editHomeAnnouncement(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $announcementId = $request->getBodyParam('id');
    if (!$announcementId) {
      return Response::json(['error' => 'ID is required'], StatusCode::BAD_REQUEST);
    }
    $filePath = implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, 'announcements', 'announcements.json']);
    if (!file_exists($filePath) ||!is_readable($filePath)) {
      return Response::json(['error' => 'Announcements Records not found'], StatusCode::NOT_FOUND);
    }
    $data = json_decode(file_get_contents($filePath), true);
    foreach($data as $n => $item) {
      if (strval($item['id']) === strval($announcementId)) {
        $data[$n] = [...($request->getBody())];
        // write to file again
        file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
        return Response::json(['success' => 'Announcement Edited']);
      }
    }
    return Response::json(['error' => 'Announcement not found'], StatusCode::NOT_FOUND);
  }

  public function addHomeAnnouncement(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $announcementId = $request->getBodyParam('id');
    if (!$announcementId) {
      return Response::json(['error' => 'ID is required'], StatusCode::BAD_REQUEST);
    }
    $filePath = implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, 'announcements', 'announcements.json']);
    if (!file_exists($filePath) ||!is_readable($filePath)) {
      return Response::json(['error' => 'Announcements Records not found'], StatusCode::NOT_FOUND);
    }
    $data = json_decode(file_get_contents($filePath), true);
    $data[] = [...($request->getBody())];
    if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT))) {
      // write to file again
      return Response::json(['success' => 'Announcement Posted']);
    }
    return Response::json(['error' => 'Announcement failed to post'], StatusCode::NOT_FOUND);
  }

  public function deleteHomeAnnouncement(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $announcementId = $request->getBodyParam('id');
    if (!$announcementId) {
      return Response::json(['error' => 'ID is required'], StatusCode::BAD_REQUEST);
    }
    $filePath = implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, 'announcements', 'announcements.json']);
    if (!file_exists($filePath) || !is_readable($filePath)) {
      return Response::json(['error' => 'Announcements Records not found'], StatusCode::NOT_FOUND);
    }
    $data = json_decode(file_get_contents($filePath), true);
    $data = [...(array_filter($data, function($d) use($announcementId) {
      return strval($d['id']) !== strval($announcementId);
    }))];
    if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT))) {
      // write to file again
      return Response::json(['success' => 'Announcement Removed']);
    }
    return Response::json(['error' => 'Announcement failed to remove'], StatusCode::NOT_FOUND);
  }

  public function homeMostViews(Request $request): Response
  {
    try {
      $db = Database::getInstance();
      // theses
      $thesisStudents = $db->getAllRows(ThesisReads::class);
      $thesisPersonnels = $db->getAllRows(ThesisPersonnelReads::class);
      $allThesisReads = array_merge($thesisStudents, $thesisPersonnels);
      $frequencies = [];
      foreach ($allThesisReads as $read) {
        $thesisId = $read->thesis_id;
        $thesis = $db->fetchOne(Thesis::class, [(new Thesis())->getPrimaryKey() => $thesisId]);
        if ($thesis) {
          if (!isset($frequencies[strval($thesisId)])) {
            $frequencies[strval($thesisId)] = [
              'id' => $thesisId,
              'title' => $thesis->title,
              'views' => 1,
              'url' => $thesis->url,
              'author' => $thesis->author,
              'year' => $thesis->year,
            ];
          } else {
            $frequencies[strval($thesisId)]['views']++;
          }
        }
      }
      $theses = [];
      for($i = 0; $i < 5; $i++) {
        if (!empty($frequencies)) {
          $keys = array_keys($frequencies);
          $max_key = array_reduce($keys, function ($prev, $kf) use ($frequencies) {
            return $prev === "0" ? $kf : ($frequencies[$kf]['views'] > $frequencies[$prev]['views'] ? $kf : $prev);
          }, "0");
          $theses[] = $frequencies[$max_key];
          unset($frequencies[$max_key]);
        } else break;
      }
      // journals
      $journalStudents = $db->getAllRows(JournalReads::class);
      $journalPersonnels = $db->getAllRows(JournalPersonnelReads::class);
      $allJournalReads = array_merge($journalStudents, $journalPersonnels);
      $frequencies = [];
      foreach ($allJournalReads as $read) {
        $journalId = $read->journal_id;
        $journal = $db->fetchOne(Journal::class, [(new Journal())->getPrimaryKey() => $thesisId]);
        if ($journal) {
          if (!isset($frequencies[strval($journalId)])) {
            $frequencies[strval($journalId)] = [
              'id' => $journalId,
              'title' => $journal->title,
              'views' => 1,
              'url' => $journal->url,
              'author' => $journal->author,
              'year' => $journal->year,
            ];
          } else {
            $frequencies[strval($journalId)]['views']++;
          }
        }
      }
      $journals = [];
      for($i = 0; $i < 5; $i++) {
        if (!empty($frequencies)) {
          $keys = array_keys($frequencies);
          $max_key = array_reduce($keys, function ($prev, $kf) use ($frequencies) {
            return $prev === "0" ? $kf : ($frequencies[$kf]['views'] > $frequencies[$prev]['views'] ? $kf : $prev);
          }, "0");
          $journals[] = $frequencies[$max_key];
          unset($frequencies[$max_key]);
        } else break;
      }
      $results = [
        "theses" => $theses,
        "journals" => $journals,
      ];
      return Response::json(['success' => $results]);
    } catch (\Exception $e) {
      return Response::json(['error' => $e->getMessage()]);
    }
  }

  public function studentInfo(Request $request): Response
  {
    $q = $request->getQueryParam("q");
    try {
      switch ($q) {
        case 'exist':
          $db = Database::getInstance();
          $studentId = $request->getQueryParam('id');
          $student = $db->fetchOne(Student::class, ['student_id' => $studentId]);
          return Response::json(['exists' => $student ? true : false]);
        case 'profile':
          $db = Database::getInstance();
          $studentId = $request->getQueryParam('id');
          $student = $db->fetchOne(Student::class, ['student_id' => $studentId]);
          $student = $student ? $student->toArray() : [];
          return Response::json(['data' => $student]);
      }
      return Response::json(['error' => 'Bad Request'], StatusCode::BAD_REQUEST);
    } catch (\Throwable $e) {
      return Response::json(['error' => $e->getMessage()]);
    }
  }

  public function signup(Request $request): Response
  {
    try {
      // Check if inputs are provided
      if (!$request->getBodyParam('account') || !$request->getBodyParam('username') || !$request->getBodyParam('full_name') || !$request->getBodyParam('password') || !$request->getBodyParam('email')) {
        return Response::json(['error' => 'Missing required inputs. ' . json_encode($request->getBody())], StatusCode::BAD_REQUEST);
      }

      // Validate account type (admin, personnel, student)
      if (!in_array($request->getBodyParam('account'), ['admin', 'personnel', 'student'])) {
        return Response::json(['error' => 'Invalid account type.'], StatusCode::BAD_REQUEST);
      }

      $accountType = $request->getBodyParam('account');
      // Validate and sanitize inputs here
      $data = match ($accountType) {
        'admin' => [
          'admin_user' => $request->getBodyParam('username'),
          'full_name' => $request->getBodyParam('full_name'),
          'email' => $request->getBodyParam('email'),
          'password' => password_hash($request->getBodyParam('password'), PASSWORD_DEFAULT),
        ],
        'personnel' => [
          'personnel_id' => $request->getBodyParam('username'),
          'full_name' => $request->getBodyParam('full_name'),
          'email' => $request->getBodyParam('email'),
          'department' => $request->getBodyParam('department'),
          'password' => password_hash($request->getBodyParam('password'), PASSWORD_DEFAULT),
        ],
        'student' => [
          'student_id' => $request->getBodyParam('username'),
          'full_name' => $request->getBodyParam('full_name'),
          'email' => $request->getBodyParam('email'),
          'password' => password_hash($request->getBodyParam('password'), PASSWORD_DEFAULT),
          'department' => $request->getBodyParam('department'),
          'course' => $request->getBodyParam('course'),
          'year' => intval($request->getBodyParam('year')),
        ],
      };
      switch ($accountType) {
        case 'admin':
          $model = new Admin($data);
          $id = $model->create();
          (new AdminLogs(['admin_id' => $id, 'activity' => "Admin ID: {$id}, username: {$model->admin_user}, fullname: {$model->full_name} has newly been registered"]))->create();
          break;
        case 'personnel':
          $db = Database::getInstance();
          if ($db->fetchOne(Personnel::class, [(new Personnel())->getPrimaryKey() => $data['personnel_id']])) {
            return Response::json(['success' => false, 'error' => 'Employee ID already registered.']);
          }
          Logger::write_info(json_encode(['REgistering_data' => $data, 'accountType' => $accountType]));
          $model = new Personnel($data);
          $id = $model->create(true);
          (new AdminLogs(['admin_id' => RouterSession::getUserId(), 'activity' => "Personnel ID: {$id}, fullname: {$model->full_name} has newly been registered"]))->create();
          (new PersonnelLogs(['personnel_id' => $id, 'activity' => "Personnel ID: {$id}, fullname: {$model->full_name} has newly been registered"]))->create();
          break;
        case 'student':
          $id_pattern = "/^20\\d{7}$/";
          $name_pattern = "/^[A-ZÑ]+(?: [A-ZÑ]+)*?(?: [A-ZÑ]\\. )?(?:[A-ZÑ]+(?: [A-ZÑ]+)*)?(?: (?:III|IV|V|VI|VII|VIII|IX|X))?$/";
          if (!preg_match($id_pattern, $data['student_id']) || !preg_match($name_pattern, $data['full_name'])) {
            return Response::json(['success' => false, 'error' => 'Invalid student ID format.']);
          }
          $model = new Student($data);
          try {
            $id = $model->create(true);
            // Logger::write_debug("ID Registered is: {$id}");
            (new StudentLogs(['student_id' => $id, 'activity' => "Student ID: {$id}, fullname: {$request->getBodyParam('full_name')} has newly been registered"]))->create();
          } catch (\PDOException $e) {
            return Response::json(['success' => false, 'error' => $e->getMessage()]);
          }
          break;
      }
      Logger::write_info("Account registered: accountType={$accountType}, databaseId={$id}, full_name={$request->getBodyParam('full_name')}");
      return Response::json(['success' => true]);
    } catch (\Throwable $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function update(Request $request): Response
  {
    $body = $request->getBody();
    try {
      // Check if inputs are provided
      if (!isset($body['account']) || !isset($body['full_name']) || !isset($body['email'])) {
        return Response::json(['error' => 'Missing required inputs. ' . json_encode($body)], StatusCode::BAD_REQUEST);
      }

      // Validate account type (admin, personnel, student)
      if (!in_array($body['account'], ['admin', 'personnel', 'student'])) {
        return Response::json(['error' => 'Invalid account type.'], StatusCode::BAD_REQUEST);
      }

      $accountType = $body['account'];
      // Validate and sanitize inputs here
      $data = match ($accountType) {
        'admin' => [
          'full_name' => $body['full_name'],
          'email' => $body['email'],
        ],
        'personnel' => [
          'full_name' => $body['full_name'],
          'email' => $body['email'],
          'department' => $body['department'],
        ],
        'student' => [
          'full_name' => $body['full_name'],
          'email' => $body['email'],
          'department' => $body['department'],
          'course' => $body['course'],
          'year' => intval($body['year']),
        ],
      };

      if (!empty($body['password'])) {
        // Logger::write_debug('Password: ' . $body['password']);
        $data['password'] = password_hash($body['password'], PASSWORD_DEFAULT);
      }
      $db = Database::getInstance();
      switch ($accountType) {
        case 'admin':
          $id = RouterSession::getUserId();
          $model = $db->fetchOne(Admin::class, conditions: ['id' => $id]);
          if (!$model) {
            return Response::json(['error' => 'Admin not found.'], StatusCode::NOT_FOUND);
          }
          $model->setAttributes($data);
          if ($model->update()) {
            (new AdminLogs(['admin_id' => $model->getPrimaryKeyValue(), 'activity' => "Admin ID: {$id}, username: {$model->admin_user}, fullname: {$model->full_name} has newly been updated"]))->create();
          }
          break;
        case 'personnel':
          $id = !empty($body['username']) ? $body['username'] : RouterSession::getUserId();
          $model = $db->fetchOne(Personnel::class, ['personnel_id' => $id]);
          if (!$model) {
            return Response::json(['error' => 'Teacher Account not found.'], StatusCode::NOT_FOUND);
          }
          $model->setAttributes($data);
          if ($model->update()) {
            if (!empty($body['username'])) {
              (new AdminLogs(['admin_id' => RouterSession::getUserId(), 'activity' => "Personnel ID: {$id}, fullname: {$model->full_name} has been updated"]))->create();
            }
            (new PersonnelLogs(['personnel_id' => $id, 'activity' => "Personnel ID: {$id}, fullname: {$model->full_name} has been updated"]))->create();
          }
          break;
        case 'student':
          $id_pattern = "/^20\\d{7}$/";
          $name_pattern = "/^[A-ZÑ]+(?: [A-ZÑ]+)*?(?: [A-ZÑ]\\. )?(?:[A-ZÑ]+(?: [A-ZÑ]+)*)?(?: (?:III|IV|V|VI|VII|VIII|IX|X))?$/";
          $id = !empty($body['username']) ? $body['username'] : RouterSession::getUserId();
          if (!preg_match($id_pattern, strval($id)) || !preg_match($name_pattern, $data['full_name'])) {
            return Response::json(['success' => false, 'error' => 'Invalid student ID format.']);
          }
          $model = $db->fetchOne(Student::class, ['student_id' => $id]);
          if (!$model) {
            return Response::json(['error' => 'Teacher Account not found.'], StatusCode::NOT_FOUND);
          }
          $model->setAttributes($data);
          if ($model->update()) {
            if (!empty($body['username'])) {
              (new AdminLogs(['admin_id' => RouterSession::getUserId(), 'activity' => "Student ID: {$id}, fullname: {$model->full_name} has been updated"]))->create();
            }
            (new StudentLogs(['student_id' => $id, 'activity' => "Student ID: {$id}, fullname: {$model->full_name} has been updated"]))->create();
          }
          break;
      }
      Logger::write_info("Account updated: accountType={$accountType}, databaseId={$id}, full_name={$body['full_name']}");
      return Response::json(['success' => true]);
    } catch (\Throwable $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function login(Request $request): Response
  {
    $body = $request->getBody();
    try {
      // check authenticated users before logging in
      if (RouterSession::isAuthenticated()) {
        return Response::json(['success' => false, 'error' => 'Already authenticated.']);
      }

      // Check if inputs are provided
      if (!isset($body['account']) || !isset($body['username']) || !isset($body['password'])) {
        return Response::json(['error' => 'Missing required inputs. ' . json_encode($body)], StatusCode::BAD_REQUEST);
      }

      // Validate account type (admin, personnel, student)
      if (!in_array($body['account'], ['admin', 'personnel', 'student'])) {
        return Response::json(['error' => 'Invalid account type.'], StatusCode::BAD_REQUEST);
      }

      $db = Database::getInstance();
      // Validate and sanitize inputs here
      $account = $body['account'];
      $username = $body['username'];
      $password = $body['password'];

      $condition = ['student_id' => $username];
      $modelClass = Student::class;
      switch ($account) {
        case 'admin':
          $condition = ['admin_user' => $username];
          $modelClass = Admin::class;
          break;
        case 'personnel':
          $condition = ['personnel_id' => $username];
          $modelClass = Personnel::class;
          break;
      }
      $user = $db->fetchOne($modelClass, $condition);

      // Check if password matches
      if ($user && password_verify($password, $user->password)) {
        $userId = match ($account) {
          'admin' => $user->id,
          'personnel' => $user->personnel_id,
          'student' => $user->student_id,
        };
        // Logger::write_debug("User found: account={$account}, id={$userId}, full_name={$user->full_name}");
        // Create JWT token and update session data
        if ($userId) {
          // Logger::write_debug("User authenticated: account={$account}, id={$userId}");
          RouterSession::create($account, $userId, $user->full_name);
          // Logger::write_debug("User done: account={$account}, id={$userId}");
          $clientIp = RouterSession::getClientIpAddress();
          switch ($account) {
            case 'admin':
              (new AdminLogs(['admin_id' => $userId, 'activity' => "Logged in at {$clientIp}"]))->create();
              break;
            case 'personnel':
              (new PersonnelLogs(['personnel_id' => $userId, 'activity' => "Logged in at {$clientIp}"]))->create();
              break;
            case 'student':
              (new StudentLogs(['student_id' => $userId, 'activity' => "Logged in at {$clientIp}"]))->create();
              break;
          }

          // Logger::write_debug("User logged in: account={$account}, id={$userId}, full_name={$user->full_name}");
          return Response::json(['success' => true]);
        }
      }
      return Response::json(['success' => false, 'error' => 'Invalid username or password.']);
    } catch (\Throwable $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function logout(): Response
  {
    // Check if authenticated users before logging out
    if (!RouterSession::isAuthenticated()) {
      Logger::write_info("Attempted to log out without being authenticated. IP: {RouterSession::getClientIpAddress()}");
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }

    RouterSession::logout();
    return Response::redirect('/');
  }

  public function thesisList(): Response
  {
    if (!RouterSession::isAuthenticated()) {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $thesis = $db->getAllRows(Thesis::class);
      return Response::json(['success' => array_map(fn($t) => [...$t->toArray(true), 'reads' => count([...$db->fetchMany(ThesisReads::class, ['thesis_id' => $t->getPrimaryKeyValue()]), ...$db->fetchMany(ThesisPersonnelReads::class, ['thesis_id' => $t->getPrimaryKeyValue()])]) ], $thesis)]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }
  public function journalList(): Response
  {
    if (!RouterSession::isAuthenticated()) {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $journal = $db->getAllRows(Journal::class);
      $journals = array_map(fn($j) => [
        ...$j->toArray(true),
      ], $journal);
      return Response::json(['success' => [...$journals]]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function dashboardStatistics(): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $thesis = Thesis::getRowCount();
      $journal = Journal::getRowCount();
      $student = Student::getRowCount();
      $personnel = Personnel::getRowCount();
      $allThesis = $db->getAllRows(Thesis::class);
      $thesisPublic = array_filter($allThesis, fn($th) => $th->is_public);
      $thesisPublished = count($thesisPublic);
      $allJournals = $db->getAllRows(Thesis::class);
      $journalPublic = array_filter($allJournals, fn($jn) => $jn->is_public);
      $journalPublished = count($journalPublic);

      $thesisReads = [...$db->getAllRows(modelClass: ThesisReads::class), ...$db->getAllRows(ThesisPersonnelReads::class)];
      $now = new DateTime();
      $startOfWeek = (clone $now)->modify('monday this week');
      $endOfWeek = (clone $now)->modify('sunday this week');
      $weeklyThesisReads = count(array_filter($thesisReads, function($tr) use ($startOfWeek, $endOfWeek) {
        $createdAt = $tr->created_at; // Ensure this is a DateTime object
        return $createdAt >= $startOfWeek && $createdAt <= $endOfWeek;
      }));
      $startOfTheMonth = (clone $now)->modify('first day of this month');
      $endOfTheMonth = (clone $now)->modify('last day of this month');
      $monthlyThesisReads = count(array_filter($thesisReads, function($tr) use ($startOfTheMonth, $endOfTheMonth) {
        $createdAt = $tr->created_at; // Ensure this is a DateTime object
        return $createdAt >= $startOfTheMonth && $createdAt <= $endOfTheMonth;
      }));
      $startOfTheYear = (clone $now)->modify('first day of this year');
      $endOfTheYear = (clone $now)->modify('last day of this year');

      $yearlyThesisReads = count(array_filter($thesisReads, function($tr) use ($startOfTheYear, $endOfTheYear) {
        $createdAt = $tr->created_at; // Ensure this is a DateTime object
        return $createdAt >= $startOfTheYear && $createdAt <= $endOfTheYear;
      }));

      return Response::json(['success' => [
        "theses" => $thesis,
        "journals" => $journal,
        "publishedTheses" => $thesisPublished,
        "publishedJournals" => $journalPublished,
        "students" => $student,
        "teachers" => $personnel,
        "weeklyThesisReads" => $weeklyThesisReads,
        "monthlyThesisReads" => $monthlyThesisReads,
        "yearlyThesisReads" => $yearlyThesisReads,
      ]]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function publishThesis(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getBodyParam('id');
    $is_public = boolval($request->getBodyParam('is_public'));
    if (!$id) {
      return Response::json(['error' => 'Missing Thesis ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $thesis = Database::getInstance()->fetchOne(Thesis::class, [(new Thesis())->getPrimaryKey() => $id]);
      // publish the thesis
      $thesis->is_public = $is_public;
      $success = $thesis->update();
      return Response::json(['success'=> $success], $success ? StatusCode::CREATED : StatusCode::OK);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }


  public function publishJournal(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getBodyParam('id');
    $is_public = boolval($request->getBodyParam('is_public'));
    if (!$id) {
      return Response::json(['error' => 'Missing Journal ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $journal = Database::getInstance()->fetchOne(Journal::class, [(new Journal())->getPrimaryKey() => $id]);
      // publish the journal
      $journal->is_public = $is_public;
      $success = $journal->update();
      return Response::json(['success'=> $success], $success ? StatusCode::CREATED : StatusCode::OK);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function deleteThesis(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getQueryParam('id');
    if (!$id) {
      return Response::json(['error' => 'Missing Thesis ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $thesis = Database::getInstance()->fetchOne(Thesis::class, [(new Thesis())->getPrimaryKey() => $id]);
      // remove the file associated with the thesis
      $queryString = explode("?", $thesis->url)[1];
      $params = [];
      parse_str($queryString, $params);
      if (isset($params['filename'])) {
        $filename = $params['filename'] . ".pdf";
        try {
          // remove the file from the server
          unlink(implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, "thesis", $filename]));
          Logger::write_info("Deleted thesis file: {$filename}");
        } catch (\Throwable $e) {
          Logger::write_error("Failed to delete thesis file: {$filename}");
        }
      }
      $thesis->delete();
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function deleteJournal(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getQueryParam('id');
    if (!$id) {
      return Response::json(['error' => 'Missing Journal ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $journal = Database::getInstance()->fetchOne(Journal::class, [(new Journal())->getPrimaryKey() => $id]);
      // remove the file associated with the journal
      $queryString = explode("?", $journal->url)[1];
      $params = [];
      parse_str($queryString, $params);
      if (isset($params['filename'])) {
        $filename = $params['filename'] . ".pdf";
        try {
          // remove the file from the server
          unlink(implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, "journal", $filename]));
          Logger::write_info("Deleted journal file: {$filename}");
        } catch (\Throwable $e) {
          Logger::write_error("Failed to delete journal file: {$filename}");
        }
      }
      $journal->delete();
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allPublicTheses(Request $request): Response
  {
    try {
      $student = $request->getQueryParam('student');
      $teacher = $request->getQueryParam('personnel');
      if (($student || $teacher) && !RouterSession::isAuthenticated()) {
        return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
      }
      $db = Database::getInstance();
      $allThesis = $db->getAllRows(Thesis::class);
      $valueTheses = array_filter($allThesis, fn($th) => $th->is_public);
      if ($student) {
        $favorites = $db->fetchMany(ThesisFavorites::class, ['student_id' => $student]);
        $mapped = array_map(fn($fav) => $fav->thesis_id, $favorites);
        $theses = array_map( fn($thesis) => [
          ...$thesis->toArray(true),
          "favorite" => in_array($thesis->getPrimaryKeyValue(), $mapped ?? []),
          "totalViews" => $db->getRowCount(ThesisReads::class, ['thesis_id' => $thesis->getPrimaryKeyValue()]),
        ], $valueTheses);
      } else if ($teacher) {
        $favorites = $db->fetchMany(ThesisPersonnelFavorites::class, ['personnel_id' => $teacher]);
        $mapped = array_map(fn($fav) => $fav->thesis_id, $favorites);
        $theses = array_map( fn($thesis) => [
          ...$thesis->toArray(true),
          "favorite" => in_array($thesis->getPrimaryKeyValue(), $mapped ?? []),
          "totalViews" => $db->getRowCount(ThesisReads::class, ['thesis_id' => $thesis->getPrimaryKeyValue()]),
        ], $valueTheses);
      } else {
        $theses = array_map(fn($t) => [
          ...$t->toArray(true),
          "totalViews" => $db->getRowCount(ThesisReads::class, ['thesis_id' => $t->getPrimaryKeyValue()]),
        ], $valueTheses);
      }
      return Response::json(['success' => [...$theses]]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allPublicJournal(Request $request): Response
  {
    try {
      $student = $request->getQueryParam('student');
      $teacher = $request->getQueryParam('personnel');
      if (($student || $teacher) && !RouterSession::isAuthenticated()) {
        return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
      }
      $db = Database::getInstance();
      $allJournal = $db->getAllRows(Journal::class);
      $valueJournals = array_filter($allJournal, fn($jn) => $jn->is_public);
      if ($student) {
        $favorites = $db->fetchMany(JournalFavorites::class, ['student_id' => $student]);
        $mapped = array_map(fn($fav) => $fav->journal_id, $favorites);
        $journals = array_map( fn($journal) => [
          ...$journal->toArray(true),
          "favorite" => in_array($journal->getPrimaryKeyValue(), $mapped ?? []),
          "totalViews" => $db->getRowCount(JournalReads::class, ['journal_id' => $journal->getPrimaryKeyValue()]),
        ], $valueJournals);
      } else if ($teacher) {
        $favorites = $db->fetchMany(JournalPersonnelFavorites::class, ['personnel_id' => $teacher]);
        $mapped = array_map(fn($fav) => $fav->journal_id, $favorites);
        $journals = array_map( fn($journal) => [
          ...$journal->toArray(true),
          "favorite" => in_array($journal->getPrimaryKeyValue(), $mapped ?? []),
          "totalViews" => $db->getRowCount(JournalReads::class, ['journal_id' => $journal->getPrimaryKeyValue()]),
        ], $valueJournals);
      } else {
        $journals = array_map(fn($j) => [
          ...$j->toArray(true),
          "totalViews" => $db->getRowCount(JournalReads::class, ['journal_id' => $j->getPrimaryKeyValue()]),
        ], $valueJournals);
      }
      return Response::json(['success' => [...$journals]]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allStudents(): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $students = $db->getAllRows(Student::class);
      return Response::json(['success' => array_map(fn($s) => $s->toArray(), $students)]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allPersonnels(): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $personnel = $db->getAllRows(Personnel::class);
      return Response::json(['success' => array_map(fn($s) => $s->toArray(), $personnel)]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function deleteStudent(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getQueryParam('id');
    if (!$id) {
      return Response::json(['error' => 'Missing Student ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $student = Database::getInstance()->fetchOne(Student::class, [(new Student())->getPrimaryKey() => $id]);
      $student->delete();
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function deletePersonnel(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getQueryParam('id');
    if (!$id) {
      return Response::json(['error' => 'Missing Teacher ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $personnel = Database::getInstance()->fetchOne(Personnel::class, [(new Personnel())->getPrimaryKey() => $id]);
      $personnel->delete();
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function thesisMarkFavorite(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() === 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getBodyParam('id');
    $student = $request->getBodyParam('student');
    $teacher = $request->getBodyParam('personnel');
    if (!$id) {
      return Response::json(['error' => 'Missing Thesis ID.'], StatusCode::BAD_REQUEST);
    }
    if (!$student && !$teacher) {
      return Response::json(['error' => 'Bad Request'], StatusCode::BAD_REQUEST);
    }
    try {
      $condition = $student ? ['thesis_id' => $id, 'student_id' => $student] : ['thesis_id' => $id, 'personnel_id' => $teacher];
      $thesis = Database::getInstance()->fetchOne($student ? ThesisFavorites::class : ThesisPersonnelFavorites::class, $condition);
      // mark favorite or unfavorite by deleting or creating
      if ($thesis) {
        $thesis->delete();
      } else {
        $thesis = $student ? new ThesisFavorites() : new ThesisPersonnelFavorites();
        $thesis->thesis_id = $id;
        if ($student) {
          $thesis->student_id = $student;
        } else if ($teacher) {
          $thesis->personnel_id = $teacher;
        }
        $thesis->create();
      }
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function journalMarkFavorite(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() === 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getBodyParam('id');
    $student = $request->getBodyParam('student');
    $teacher = $request->getBodyParam('personnel');
    if (!$id) {
      return Response::json(['error' => 'Missing Thesis ID.'], StatusCode::BAD_REQUEST);
    }
    if (!$student && !$teacher) {
      return Response::json(['error' => 'Bad Request'], StatusCode::BAD_REQUEST);
    }
    try {
      $condition = $student ? ['journal_id' => $id, 'student_id' => $student] : ['journal_id' => $id, 'personnel_id' => $teacher];
      $db = Database::getInstance();
      $className = $student ? JournalFavorites::class : JournalPersonnelFavorites::class;
      $journal = $db->fetchOne($className, $condition);
      // mark favorite or unfavorite by deleting or creating
      if ($journal) {
        $journal->delete();
      } else {
        $journal = $student ? new JournalFavorites() : new JournalPersonnelFavorites();
        $journal->journal_id = $id;
        if ($student) {
          $journal->student_id = $student;
        } else if ($teacher) {
          $journal->personnel_id = $teacher;
        }
        $journal->create();
      }
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allFavorites(): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() === 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $accType = RouterSession::getUserAccountType();
      $myId = RouterSession::getUserId();
      if ($accType === 'student') {
        $thesesFav = $db->fetchMany(ThesisFavorites::class, ['student_id' => $myId]);
        $journalFav = $db->fetchMany(JournalFavorites::class, ['student_id' => $myId]);
        $data = array_map(fn(ThesisFavorites $th) => [...$th->fk_thesis_id->toArray(), 'read_at' => $th->created_at, 'type' => 'Thesis', 'read' => $db->getRowCount(ThesisReads::class, ['thesis_id' => $th->fk_thesis_id->getPrimaryKeyValue(), 'student_id' => RouterSession::getUserId()])], $thesesFav);
        $dataJournal = array_map(fn(JournalFavorites $jn) => [...$jn->fk_journal_id->toArray(), 'read_at' => $jn->created_at, 'type' => 'Journal', 'read' => $db->getRowCount(JournalReads::class, ['journal_id' => $jn->fk_journal_id->getPrimaryKeyValue(), 'student_id' => RouterSession::getUserId()])], $journalFav);
        $allData = [...$data, ...$dataJournal];
        Logger::write_info(json_encode($allData, JSON_PRETTY_PRINT));
        usort($allData, function($a, $b) {
          $interval = $a['read_at']->diff($b['read_at']);
          return !$interval->invert;
        });
        return Response::json(['success' => [...$allData]]);
      } else if ($accType === 'personnel') {
        $thesesFav = $db->fetchMany(ThesisPersonnelFavorites::class, ['personnel_id' => $myId]);
        $journalFav = $db->fetchMany(JournalPersonnelFavorites::class, ['student_id' => $myId]);
        $dataJournal = array_map(fn(JournalPersonnelFavorites $jn) => [...$jn->fk_journal_id->toArray(), 'read_at' => $jn->created_at, 'type' => 'Journal', 'read' => $db->getRowCount(JournalPersonnelReads::class, ['journal_id' => $jn->fk_journal_id->getPrimaryKeyValue(), 'student_id' => RouterSession::getUserId()])], $journalFav);
        $data = array_map(fn(ThesisPersonnelFavorites $th) => [...$th->fk_thesis_id->toArray(), 'read_at' => $th->created_at, 'type' => 'Thesis', 'read' => $db->getRowCount(ThesisPersonnelReads::class, ['thesis_id' => $th->fk_thesis_id->getPrimaryKeyValue(), 'personnel_id' => RouterSession::getUserId()])], $thesesFav);
        $allData = [...$data, ...$dataJournal];
        usort($allData, function($a, $b) {
          $interval = $a['read_at']->diff($b['read_at']);
          return !$interval->invert;
        });
        return Response::json(['success' => [...$allData]]);
      }
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
    return Response::json(['error'=> 'Bad Request'], StatusCode::BAD_REQUEST);
  }

  public function allDownloadables(): Response
  {
    if (!RouterSession::isAuthenticated()) {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $data = $db->getAllRows(Downloadables::class);
      return Response::json(['success' => array_map(fn($d) => $d->toArray(true), $data)]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function allAvaiableDownloadables(): Response
  {
    if (!RouterSession::isAuthenticated()) {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    try {
      $db = Database::getInstance();
      $fetched = $db->fetchMany(Downloadables::class, ['downloadable' => true]);
      $data = array_map(fn($d) => $d->toArray(true), $fetched);
      return Response::json(['success' => [...$data]]);
    } catch (\Throwable $e) {
      return Response::json(['error'=> $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function publishDownloadables(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getBodyParam('id');
    $downloadable = boolval($request->getBodyParam('downloadable'));
    if (!$id) {
      return Response::json(['error' => 'Missing ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $download = Database::getInstance()->fetchOne(Downloadables::class, [(new Downloadables())->getPrimaryKey() => $id]);
      // update the downloadable
      $download->downloadable = $downloadable;
      $success = $download->update();
      return Response::json(['success'=> $success], $success ? StatusCode::CREATED : StatusCode::OK);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

  public function deleteDownloadable(Request $request): Response
  {
    if (!RouterSession::isAuthenticated() || RouterSession::getUserAccountType() !== 'admin') {
      return Response::json(['error' => 'Not authenticated.'], StatusCode::UNAUTHORIZED);
    }
    $id = $request->getQueryParam('id');
    if (!$id) {
      return Response::json(['error' => 'Missing Downlodable File ID.'], StatusCode::BAD_REQUEST);
    }
    try {
      $downloadable = Database::getInstance()->fetchOne(Downloadables::class, [(new Downloadables())->getPrimaryKey() => $id]);
      // remove the file associated with the downloadables
      $queryString = explode("?", $downloadable->url)[1];
      $params = [];
      parse_str($queryString, $params);
      if (isset($params['filename'])) {
        $filename = $params['filename'] . $downloadable->ext;
        try {
          // remove the file from the server
          unlink(implode(DIRECTORY_SEPARATOR, [UPLOADS_PATH, "downloadable", $filename]));
          Logger::write_info("Deleted downloadable file: {$filename}");
        } catch (\Throwable $e) {
          Logger::write_error("Failed to delete downloadable file: {$filename}");
        }
      }
      $downloadable->delete();
      return Response::json(['success'=> true]);
    } catch (\PDOException $e) {
      return Response::json(['error' => $e->getMessage()], StatusCode::INTERNAL_SERVER_ERROR);
    }
  }

}
