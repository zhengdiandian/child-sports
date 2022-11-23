export interface ExamId {
  schoolexamId: number;
}

export interface ListOfExamData extends ExamId {
  fuzzyQuery?: string;
  pageNum?: number;
  pageSize?: 1;
  studentGender?: string | [];
  className?: string;
}

export interface TemplateResult {
  code: number;
  data: string;
  message: string;
}


export interface dataItem {
  schoolexamDate: string;
  schoolexamSchoolId: number;
  schoolexamClasses: Array<string>;
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


export interface ExamManagementResult {
  code: number;
  data: Array<dataItem>;
  message: string;
}


export interface StudentDetail {
  studentId: number | string;
}

export interface ExportStudentExamData {
  fuzzyQuery?: string;
  pageNum?: number;
  pageSize?: number;
  schoolexamDate?: string;
  studentId: number;

}
