const createRule = (message: string, trigger = "blur") => ([
  {
    required: true,
    message,
    trigger
  }
]);
const randomtestName = [
  {
    required: true,
    message: "请输入名称",
    trigger: "blur"
  }
];
const randomtestSchoolType = [
  {
    required: true,
    message: "请选择学校类别",
    trigger: "change"
  }
];
const date = [
  {
    type: "date",
    required: true,
    message: "请选择时间",
    trigger: "change"
  }
];
const grade = [
  {
    // type: 'date',
    required: true,
    message: "请选择年级",
    trigger: "change"
  }
];
const className = [
  {
    required: true,
    message: "请输入班级",
    trigger: "blur"
  }
];
const selectedClassName = [
  {
    required: true,
    message: "请选择班级",
    trigger: "blur"
  }
];
const studentName = [
  {
    required: true,
    message: "请选择学生",
    trigger: "change"
  }
];
const randomtestDistrictCode = [
  {
    required: true,
    message: "请选择区域",
    trigger: "change"
  }
];
const file = [
  {
    // type: 'file',
    required: true,
    message: "请选择图片",
    trigger: "change"
  }
];
const freetestStudentCode = [
  {
    required: true,
    message: "请输入学籍号",
    trigger: "blur"
  }
];
const projectList = [
  {
    type: "array",
    required: true,
    message: "请选择项目",
    trigger: "change"
  }
];
const checkMobile = (str: string) => {
  const re = /^1\d{10}$/;
  if (re.test(str)) {
    return true;
  } else {
    return false;
  }
};
const phone = [
  {
    validator: (rule: any, value: string, callback: any) => {
      if (value === "") {
        callback();

        // callback(new Error('请输入手机号码'))
      } else if (!checkMobile(value)) {
        callback(new Error("手机号码不合法"));
      } else {
        callback();
      }
    },
    // required: true,
    // message: "请选择项目",

    trigger: "blur"
  }
];
const projectNameTwo = [
  {
    validator: (rule: any, value: string, callback: any, source: any, options: any) => {
      debugger
      if (value === "") {
        callback();

        // callback(new Error('请输入手机号码'))
      } else if (!checkMobile(value)) {
        callback(new Error("手机号码不合法"));
      } else {
        callback();
      }
    },
    // required: true,
    // message: "请选择项目",

    trigger: "blur"
  }
];
const title = [
  {
    required: true,
    message: "请输入标题",
    trigger: "blur"
  }
];
const announcementContent = [
  {
    required: true,
    message: "请输入内容",
    trigger: "blur"
  }
];
const publishObject = [
  {
    type: "array",
    required: true,
    message: "请选择发布目标",
    trigger: "change"
  }
];
const validDate = [
  {
    required: true,
    message: "请选择有效期",
    trigger: "change"
  }
];

const createRateRule = (str: string) => [
  {
    validator: (rule: any, value: number, callback: any) => {
      debugger
      if (value === 0) {

        callback(new Error(`请选择${str}评分`))
      } else {
        callback();
      }
    },
    required: true,
    // message: "请选择项目",

    trigger: "change"
  }
]
export default {
  allOutScore: createRateRule("全力以赴"),
  respectScore: createRateRule("尊重"),
  passionScore: createRateRule("激情"),
  toughScore: createRateRule("坚韧"),
  uprightScore: createRateRule("正直"),
  teamSpiritScore: createRateRule("团队"),
  coach: createRule("请输入测试老师"),
  testTime: date,
  classId: createRule("请选择班级", "change"),
  matchTypes: createRule("请选择导出类型", "change"),
  projects: createRule("请选择项目", "change"),
  teacherCode: createRule("请输入教职工号"),
  teacherName: createRule("请输入教职姓名"),
  username: createRule("请输入账号名称"),
  nickName: createRule("请输入用户昵称"),
  password: createRule("请输入密码"),
  schoolName: createRule("请选择学校名", "change"),
  schoolType: createRule("请选择学校类型", "change"),
  commentaryScore: createRule("请输入点评得分"),
  commentary: createRule("请输入点评内容"),
  regularRelease: createRule("请选择定时发布类型", "change"),
  homeworkIntroduction: createRule("请输入作业内容"),
  homeworkProject: createRule("请选择作业项目", "change"),
  importMethod: createRule("请选择上传方式", "change"),
  homeworkDeadline: createRule("请输入作业期限"),
  homeworkName: createRule("请输入作业名称"),
  releaseTime: createRule("请选择发布时间", "change"),
  homeworkReleaseBegin: date,
  homeworkReleaseEnd: date,
  date: createRule("请输入时间", "change"),
  value: createRule("请输入"),
  projectDeadline: date,
  projectUnitOne: createRule("请输入单位"),
  projectNameOne: createRule("请输入自定义项目"),
  classGrade: grade,
  className,
  validDate,
  publishObject,
  title,
  announcementContent,
  subtitle: title,
  phone,
  randomtestDistrictCode,
  dailytestName: randomtestName,
  dailytestDate: date,
  dailytestGrade: grade,
  dailytestClassId: selectedClassName,
  dailytestProjectList: projectList,
  randomtestName,
  schoolexamName: randomtestName,
  randomtestSchoolType,
  randomtestStartDate: date,
  schoolexamDate: date,
  schoolexamDeadline: date,
  schoolexamGrade: grade,
  randomtestGrade: grade,
  randomtestClass: className,
  freetestStudentGrade: grade,
  freetestClassId: className,
  freetestStudentId: studentName,
  file,
  freetestValidityDate: date,
  freetestStudentCode,
  randomtestProjectList: projectList,
  randomtestAddress: [
    {
      required: true,
      message: "请输入地址",
      trigger: "blur"
    }
  ],
  randomtestIntroduction: [
    {
      required: false,
      message: "请输入抽测介绍",
      trigger: "blur"
    }
    // {
    //   min: 1,
    //   max: 5,
    //   message: '长度为1到5行',
    //   trigger: 'blur'
    // }
  ]
};
