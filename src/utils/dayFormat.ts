export const weekList = ["日", "一", "二", "三", "四", "五", "六"];
export const fullWeekList = weekList.map(item => "每周" + item);
export const dayFormat = (date: any, string = "每") => {
  const week = new Date(date).getDay();
  return string + weekList[week];
};
export const findInFullWeekListIndex = (string = "每周日") => {

  return weekList[fullWeekList.indexOf(string)];
};
