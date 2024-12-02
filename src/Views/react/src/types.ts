
export interface DashboardStatistics {
  theses: number,
  journals: number,
  publishedTheses: number,
  publishedJournals: number,
  students: number,
  teachers: number,
  weeklyThesisReads: number,
  weeklyJournalReads: number,
}

export interface NavItems {
  label: string,
  url: string,
  icon: string,
}

export interface TabLabel {
  label: string,
  key: string
}

export interface TabContextProps {
  activeTabKey: string
}

export interface NavItems {
  label: string,
  url: string
}

export interface LogMessage {
  type: LogType,
  message: string,
}

export enum LogType {
  USER_INFO = "USER INFO",
  USER_ERROR = "USER ERROR",
  USER_WARNING = "USER WARNING",
  USER_DEBUG = "USER DEBUG",
}

export enum TableCellType {
  Number = "number",
  Date = "date",
  String = "string",
  Custom = "custom",
}

export enum CellAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

export interface TableColumn {
  label: string,
  key: string,
  cellType?: TableCellType,
  sortable?: boolean,
  filterable?: boolean,
  align?: CellAlign,
}

export enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

type TableCell = string | number | React.ReactNode;

export interface TableRow {
  [key: string]: TableCell,
}

export type ShowEntries = 5 | 10 | 25 | 50 | 100 | 200 | 500 | 1000

export type TableProps = {
  columns: TableColumn[],
  items: TableRow[],
  search?: string,
  defaultSortOrder?: SortOrder,
  defaultSortColumn?: string,
  onShowEntries?: (entries: number) => void,
  onSortColumn?: (column: string) => void,
  onSortOrder?: (order: SortOrder) => void,
  onSearch?: (search: string) => void,
  children?: React.ReactNode
}

export enum Year {
  FirstYear = '1',
  SecondYear = '2',
  ThirdYear = '3',
  FourthYear = '4',
  Grade11 = '5',
  Grade12 = '6',
}

// College of Computing and Information Science
// -Bachelor of Science in Information Technology
// -Bachelor of Science in Computer Science
// -Bachelor of Library and Information Science
// -Diploma In Information Technology
// -Bachelor of Science in Information Systems
// -Bachelor of Science in Accounting Information Systems

// College of Arts and Sciences
// -Bachelor of Arts Major in English Language

// College of Business Management 
// -Bachelor of Science in Business Administration Major in Financial Management
// -Bachelor of Science in Business Administration major in Human Resource Management
// -Bachelor of Science in Business Administration major in Marketing Management
// -Bachelor of Public Administration
// -Bachelor of Science in Entreprenuership


// College of Criminal Justice Education
// -Bachelor of Science in Criminology

// College of Teacher Education
// -Bachelor of Elementary Education
// -Bachelor of Secondary Education major in English
// -Bachelor of Secondary Education major in Science
// -Bachelor of Secondary Education major in Social Studies
// -Bachelor of Physical Education
// -Bachelor of Technical Vocational Teacher Education
// -Bachelor of Early Childhood Education

// College of Tourism and Hospitality Management
// -Bachelor of Science in Hospitality Management
// -Bachelor of Science in Tourism Management
// -Diploma in Hospitality Management Technology
// -Diploma in Tourism Management Technology
// -Food and Beverage Services NC II
// -Housekeeping NC II
// -Ship's Catering Services NC I

export enum Departments {
  CCIS = 'College of Computing Information Sciences',
  CAS = 'College of Arts and Sciences',
  CBM = 'College of Business Management',
  CCJE = 'College of Criminal Justice Education',
  CTE = 'College of Teacher Education',
  CTHM = 'College of Tourism and Hospitality Management',
  G12 = 'Senior High School'
}

export enum Courses {
  BSCS = 'Bachelor of Science in Computer Science',
  BSIT = 'Bachelor of Science in Information Technology',
  BLIS = 'Bachelor of Library and Information Science',
  BSIS = 'Bachelor of Science in Information Systems',
  BSAIS = 'Bachelor of Science in Accounting Information Systems',
  DIT = 'Diploma In Information Technology',
  BAEL = 'Bachelor of Arts Major in English Language',
  BSBAFM = 'Bachelor of Science in Business Administration Major in Financial Management',
  BSBAHM = 'Bachelor of Science in Business Administration major in Human Resource Management',
  BSBAMM = 'Bachelor of Science in Business Administration major in Marketing Management',
  BPA = 'Bachelor of Public Administration',
  BSE = 'Bachelor of Science in Entreprenuership',
  BSC = 'Bachelor of Science in Criminology',
  BEE = 'Bachelor of Elementary Education',
  BSEE = 'Bachelor of Secondary Education major in English',
  BSES = 'Bachelor of Secondary Education major in Science',
  BSESS = 'Bachelor of Secondary Education major in Social Studies',
  BPE = 'Bachelor of Physical Education',
  BTVTE = 'Bachelor of Technical Vocational Teacher Education',
  BECE = 'Bachelor of Early Childhood Education',
  BSHM = 'Bachelor of Science in Hospitality Management',
  BSTM = 'Bachelor of Science in Tourism Management',
  DHMT = 'Diploma in Hospitality Management Technology',
  DTMT = 'Diploma in Tourism Management Technology',
  FBSNCII = 'Food and Beverage Services NC II',
  HNCII = 'Housekeeping NC II',
  SCSNCI = "Ship's Catering Services NC I",
  ABM = 'Accountancy, Business, and Management',
  GAS = 'General Academic Strand',
  HUMSS = 'Humanities and Social Sciences',
  STEM = 'Science, Technology, Engineering and Mathematics',
  ICT = 'Information Technology Animation NCII,Computer System Servicing NCII',

}

export const DepartmentCourses: { [key: Departments|string]: Courses[] } = {
  [Departments.CCIS]: [
    Courses.BSCS,
    Courses.BSIT,
    Courses.BLIS,
    Courses.BSIS,
    Courses.BSAIS,
    Courses.DIT,
  ],
  [Departments.CAS]: [
    Courses.BAEL,
  ],
  [Departments.CBM]: [
    Courses.BSBAFM,
    Courses.BSBAHM,
    Courses.BSBAMM,
    Courses.BPA,
    Courses.BSE,
  ],
  [Departments.CCJE]: [
    Courses.BSC,
  ],
  [Departments.CTE]: [
    Courses.BEE,
    Courses.BSEE,
    Courses.BSES,
    Courses.BSESS,
    Courses.BPE,
    Courses.BTVTE,
    Courses.BECE
  ],
  [Departments.CTHM]: [
    Courses.BSHM,
    Courses.BSTM,
    Courses.DHMT,
    Courses.DTMT,
    Courses.FBSNCII,
    Courses.HNCII,
    Courses.SCSNCI,
  ],
  [Departments.G12]: [
    Courses.ABM,
    Courses.GAS,
    Courses.HUMSS,
    Courses.STEM,
    Courses.ICT,

  ]
}
