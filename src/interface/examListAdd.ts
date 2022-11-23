export interface ExamListAddParams {
  schoolexamDate: string;
  schoolexamSchoolId: number | undefined;
  schoolexamGrade: number | undefined;
  schoolexamName: string;
  schoolexamDeadline: string;

  [key: string]: any;
}

export interface dataItem {
  schoolexamDate: string;
  schoolexamSchoolId: number;
  schoolexamClasses: string;
  schoolexamMaleNum: number;
  schoolexamTestfreeNum: number;
  schoolexamGrade: number;
  schoolexamId: number;
  schoolexamStudentNum: number;
  schoolexamAvrScore: number;
  schoolexamFemaleNum: number;
  schoolexamClassNum: number;
  schoolexamName: string;
  schoolexamDeadline: string;
}

export interface ExamListAddResult {
  code: number;
  data: dataItem;
  message: string;
}
