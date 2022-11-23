import { useRoute } from "vue-router";
import store from "@/store/index";
// import { AreaInformation, DailyPhysical } from "@/interface/data-overview";
import { SchoolType } from "@/utils/baseData";

// const store = useStore()
export default (function() {
  const route = useRoute();
  const {
    schoolCity,
    schoolProvince,
    schoolDistrict,
    schoolId,
    schoolType,
    schoolName,
    id,
    teacherId
  } = store.state.User.userRoles;

  interface IDailyPhysical {
    schoolCity?: number
    schoolDistrict?: number
    schoolId?: number,
    schoolProvince?: number
    schoolType: string
  }

  class DailyPhysical implements IDailyPhysical {
    schoolCity?: number = schoolCity;
    schoolDistrict?: number = schoolDistrict;
    schoolId?: number = schoolId;
    schoolProvince?: number = schoolProvince;
    schoolType: string = schoolType ? schoolType : SchoolType[1].label;
    schoolName: string = schoolName;

  }

  class AreaInformation {
    city = schoolCity;
    district = schoolDistrict;
    province = schoolProvince;
  }

  let schoolTypeList = [];
  if (SchoolType.map(({ label }) => label).includes(schoolType)) {
    schoolTypeList = SchoolType.filter(({ label }) => label === schoolType);
  } else {
    schoolTypeList = SchoolType;
  }
  return {
    teacherId,
    route,
    id,
    schoolCity,
    schoolProvince,
    schoolDistrict,
    schoolId,
    schoolType,
    AreaInformation: new AreaInformation(),
    DailyPhysical: new DailyPhysical(),
    schoolTypeList
  };
});
