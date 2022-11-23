import female from "@/img/female.png";
import male from "@/img/male.png";

export const avatarGeneration = (gender: "男" | "女") => {
  if (gender === "男") {
    return male;
  }
  return female;
};
export const projectList = [
  {
    name: "跳绳",
    type: "1"
  },
  {
    name: "坐位体前屈",
    type: "2"
  },
  {
    name: "50米跑",
    type: "2"
  },
  {
    name: "1分钟仰卧起坐",
    type: "2"
  },
  {
    name: "立定跳远",
    type: "2"
  }
];
export const SchoolType = [
  { label: "小学" },
  { label: "中学" }
  // {label: '九年一贯'},
];
export const Grade = [
  {
    label: "一年级",
    value: 1
  },
  {
    label: "二年级",
    value: 2
  },
  {
    label: "三年级",
    value: 3
  },
  {
    label: "四年级",
    value: 4
  },
  {
    label: "五年级",
    value: 5
  },
  {
    label: "六年级",
    value: 6
  },
  {
    label: "七年级",
    value: 7
  },
  {
    label: "八年级",
    value: 8
  },
  {
    label: "九年级",
    value: 9
  }
];
export const gradeConversion = (value: number | string): string | number | undefined => {
  console.log(value);
  if (!value) return "";
  if (typeof value === "number") {
    if (value > 9) return "已毕业";
    return Grade.find((item) => item.value == value)?.label;
  } else {
    return Grade.find((item) => item.label == value)?.value;
  }
};
export const filterGradeList = (type: "小学" | "初中" | "九年一贯"): object[] => {
  if (type === "九年一贯") return Grade;
  if (type === "小学") {
    return Grade.slice(0, 6);
  } else {
    return Grade.slice(6, Grade.length);
  }
};
export const Gender = [
  {
    label: "全部",
    value: 0
  },
  {
    label: "男",
    value: 1
  },
  {
    label: "女",
    value: 2
  }
];
export const statusNameList = [
  { name: "运动能力", icon: "icon-yiliaohangyedeICON-", color: "#60C2DA", fieldName: "ability" },
  {
    name: "健康行为",
    icon: "icon-shuyec",
    color: "#72AB2A",
    fieldName: "behavior"
  },
  {
    name: "体育品德", icon: "icon-hua", color: "#F48B58",
    fieldName: "morality"
  }
];
