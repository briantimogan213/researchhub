import DashboardPage from './admin/dashboard';
import ManageDepartmentsPage from './admin/departments';
import DownloadsPage from './admin/downloads';
import GuestsPage from './admin/guests';
import HomepageManagementPage from './admin/homepage';
import JournalsPage from './admin/journal';
import AdminLogin from './admin/login';
import StudentsPage from './admin/students';
import TeachersPage from './admin/teachers';
import ThesesPage from './admin/theses';
import AccountSettings from './global/settings';
import GuestLogin from './guest/login';
import GuestSignup from './guest/signup';
import { render as renderHomePage } from './home';
import LogsApp from './logs';
import AboutUs from './main/about';
import { Downloads } from './main/downloads';
import Journal from './main/journal';
import Library from './main/library';
import Thesis from './main/thesis';
import Print from './print/page';
import RootPage from './root';
import StudentLogin from './student/login';
import StudentSignup from './student/signup';
import TeacherLogin from './teacher/login';

const routes: { [path: string]: any } = {
  "root": RootPage,
  'student/login': StudentLogin,
  'admin/login': AdminLogin,
  'teacher/login': TeacherLogin,
  'guest/login': GuestLogin,
  'student/signup': StudentSignup,
  'guest/signup': GuestSignup,
  "home": { render: renderHomePage },
  'main/thesis': Thesis,
  'main/journal': Journal,
  'main/downloads': Downloads,
  'main/about': AboutUs,
  'main/library': Library,
  'admin/dashboard': DashboardPage,
  'admin/theses': ThesesPage,
  'admin/journal': JournalsPage,
  'print/page': Print,
  'admin/departments': ManageDepartmentsPage,
  'admin/homepage': HomepageManagementPage,
  'admin/downloads': DownloadsPage,
  'admin/students': StudentsPage,
  'admin/teachers': TeachersPage,
  'admin/guests': GuestsPage,
  'settings': AccountSettings,
  'logs': LogsApp
}

export default routes;