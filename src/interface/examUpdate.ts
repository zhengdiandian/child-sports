import { ExamListAddParams } from "@/interface/examListAdd";

export interface BizUpdateSchoolexamParam extends ExamListAddParams {
  schoolexamId: number;
  schoolexamDate: string;
  schoolexamSchoolId: number | undefined;
  schoolexamGrade: number | undefined;
  schoolexamName: string;
  schoolexamDeadline: string;
}
