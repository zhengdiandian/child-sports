import districts from "@/utils/city.js";

export const getCityName = (province = 370000, city = 370100) => {
  try {
    return districts[province][city];
  } catch (e) {
    return "";
  }
};
export const getCityCode = (cityName: string, province = 370000, city = 370100) => {
  try {
    return Object.keys(districts[province]).find((key: string) => districts[province][key] === cityName);

  } catch {
    return undefined;
  }
};
export const getProvinceName = (province = 370000, city = 370100) => {
  try {
    return districts[100000][province];

  } catch (e) {
    return ''
  }
};
export const getDistrictName = (province = 370000, city = 370100, district: number) => {
  try {
    return districts[city][district];

  } catch (e) {
    return ''
  }
};
export const getDistrictCode = (district: string, province = 370000, city = 370100) => {
  try {
    return Object.keys(districts[city]).find((key: string) => districts[city][key] === district);

  } catch (e) {
    console.log(e);
    return undefined;
  }
};
