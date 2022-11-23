export interface IFilterData {
  fuzzyQuery: string,
  pageNum: number,
  pageSize: number,
  schoolId: number,
  grade: string,
  classId: undefined,
  teacherName: undefined
}


export interface ICreatForm {
  classGrade: number | undefined;
  projectDeadline: string;
  projectClassId: number | undefined;
  projectNameTwo: string | undefined;
  projectUnitTwo: string | undefined;
  className: string;
  projectSchoolId: number;
  projectUnitOne: string | undefined;
  projectNameOne: string | undefined;

  [key: string]: any;
}

