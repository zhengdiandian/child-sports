export const colors = [
  "#47A19A",
  "#60C2DA",
  "#F48B58",
  "#FCD879",
  "#435C79",
  "#8d98b3",
  "#e5cf0d",
  "#97b552",
  "#95706d",
  "#dc69aa",
  "#07a2a4",
  "#9a7fd1",
  "#588dd5",
  "#f5994e",
  "#c05050",
  "#59678c",
  "#c9ab00",
  "#7eb00a",
  "#6f5553",
  "#c14089"
];
export const level = ["优秀", "良好", "及格", "不及格", "未完成"];
export const scoreToLevel = (score) => {
  if (score >= 90) {
    return level[0];
  }
  if (score >= 80) {
    return level[1];
  }
  if (score >= 60) return level[2];
  return level[3];
};
export const BMILevel = ["正常", "低体重", "超重", "肥胖", "未完成"];
export const findColor = (str) => {
  if (!str) return "#fff";
  // try {
  console.log(str, "level");
  let index = level.indexOf(str);
  if (index !== -1) {
    console.log(colors[index], "131100");
    return colors[index];
  } else {
    return colors[BMILevel.indexOf(str)];
  }
  // }catch (e) {
  //   return '#fff'
  // }

};
