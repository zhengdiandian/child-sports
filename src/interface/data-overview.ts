import store from "@/store/index";
import { SchoolType } from "@/utils/baseData";
// const store = useStore()
const { schoolCity, schoolProvince, schoolDistrict, schoolId, schoolType, schoolName } = store.state.User.userRoles;

// console.log(, 'ssss')
export interface IDailyPhysical {
  schoolCity?: number
  schoolDistrict?: number
  schoolId?: number | string,
  schoolProvince?: number
  schoolType: string,
  examName: string;

}

export class DailyPhysical implements IDailyPhysical {
  schoolCity?: number = schoolCity;
  schoolDistrict?: number = schoolDistrict;
  schoolId?: number | string = schoolId;
  schoolProvince?: number = schoolProvince;
  schoolType: string = schoolType ? schoolType : SchoolType[1].label;
  schoolName: string = schoolName;
  examName: string = "";

}

export class AreaInformation {
  city = schoolCity;
  district = schoolDistrict;
  province = schoolProvince;
}

export interface ISoreResultsData {
  goodRate: number;
  excellentRate: number;
  studentNumber: number;
  passRate: number;
  classNumber: number;
  femaleNumber: number;
  maleNumber: number;
  avgScore: number;
  parentNumber: any;
  undoneRate: number;
  schoolNumber: number;
  schoolExamName: string;
  peTeacherNumber: number;
  noPassRate: number;
}

export interface ISoreResults {
  code: number;
  data: ISoreResultsData;
  message: string;
}

export class ScoreResultsData implements ISoreResultsData {
  avgScore: number = 0;
  classNumber: number = 0;
  excellentRate: number = 0;
  femaleNumber: number = 0;
  goodRate: number = 0;
  maleNumber: number = 0;
  noPassRate: number = 0;
  parentNumber: any;
  passRate: number = 0;
  peTeacherNumber: number = 0;
  schoolExamName: string = "";
  schoolNumber: number = 0;
  studentNumber: number = 0;
  undoneRate: number = 0;


}

export interface dataItem {
  female: femaleItem;
  male: maleItem;
}

export interface femaleItem {
  goodRate: number;
  excellentRate: number;
  studentNumber: number;
  passRate: number;
  classNumber: number;
  femaleNumber: number;
  maleNumber: number;
  avgScore: number;
  parentNumber: any;
  undoneRate: number;
  schoolNumber: number;
  schoolExamName: any;
  peTeacherNumber: number;
  noPassRate: number;
}

export interface maleItem {
  goodRate: number;
  excellentRate: number;
  studentNumber: number;
  passRate: number;
  classNumber: number;
  femaleNumber: number;
  maleNumber: number;
  avgScore: number;
  parentNumber: any;
  undoneRate: number;
  schoolNumber: number;
  schoolExamName: any;
  peTeacherNumber: number;
  noPassRate: number;
}

export interface IGender {
  code: number;
  data: dataItem;
  message: string;
}

export class GenderData implements dataItem {
  female: femaleItem;
  male: maleItem;

}
