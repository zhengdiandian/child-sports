export interface IQuery {
  isRustication: boolean;
  schoolProvinceCode: number;
  isRead: boolean;
  schoolType: string;
  pageSize: number;
  isFemale: boolean;
  pageNum: number;
  classId: number | undefined;
  isMale: boolean;
  grade: number | undefined;
  schoolId: number;
  schoolDistrictCode: number;
  keyword: string;
  schoolCityCode: number;
  isTestFree: boolean;
}

// export class Query implements IQuery {
//   classId: number;
//   grade: number;
//   isFemale: boolean;
//   isMale: boolean;
//   isRead: boolean;
//   isRustication: boolean;
//   isTestFree: boolean;
//   keyword: string;
//   pageNum: number;
//   pageSize: number;
//   schoolCityCode: number;
//   schoolDistrictCode: number;
//   schoolId: number;
//   schoolProvinceCode: number;
//   schoolType: string;
//
// }
