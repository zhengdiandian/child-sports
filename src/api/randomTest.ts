import request from "@/utils/request";
// console.log(RandomTest, '  debugger\n')
import { download } from "@/utils/download";

const api = {
  update: "/randomTestManagement/randomTestDistrictManagement/randomTest/update",
  randomTestRelease: "/randomTestManagement/randomTestRelease/randomTestRelease", // 抽测发布-抽测发布
  // downloadTemplate: '/randomTestManagement/randomTestDistrictManagement/downloadTemplate', // 下载成绩登记卡
  export: "/randomTestManagement/randomTestDistrictManagement/export", // 导出抽测详情
  randomtestList: "/randomTestManagement/randomTestDistrictManagement/randomTest/list", // 列出抽测信息
  randomTestResult: "/randomTestManagement/randomTestDistrictManagement/randomTestResult", // 查看抽测结果
  randomTestImport: "/randomTestManagement/randomTestDistrictManagement/randomTest/import", // 抽测管理-导入抽测管理信息
  randomTestExport: "/randomTestManagement/randomTestDistrictManagement/randomTest/export", // 抽测管理-导出抽测管理信息
  downloadTemplate: "/randomTestManagement/randomTestDistrictManagement/randomTest/downloadTemplate", // 抽测管理-下载抽测管理信息的导入模板
  downloadScoreCardTemplate: "/randomTestManagement/randomTestDistrictManagement/randomTestData/downloadScoreCardTemplate", // 抽测管理-抽测详情-下载成绩登记卡
  randomTestDataDownloadTemplate: "/randomTestManagement/randomTestDistrictManagement/randomTestData/downloadTemplate", // 抽测管理-抽测详情-下载成绩导入模板
  randomTestDataExport: "/randomTestManagement/randomTestDistrictManagement/randomTestData/export", // 抽测管理-抽测详情-导出抽测数据
  randomTestDataImport: "/randomTestManagement/randomTestDistrictManagement/randomTestData/import", // 抽测管理-抽测详情-导入抽测数据
  randomTestDataList: "/randomTestManagement/randomTestDistrictManagement/randomTestData/list", // 抽测管理-抽测详情-列出抽测数据
  getRandomTestById: "/randomTestManagement/getRandomTestById", // 公共接口-根据抽测的主键获取抽测信息
  getResults: "/randomTestManagement/randomTestDistrictManagement/randomTestResult/getResults", // 抽测管理-查看结果-查看抽测数据统计结果
  getProjectsByGender: "/randomTestManagement/randomTestDistrictManagement/randomTestResult/getProjectsByGender", // 抽测管理-查看结果-获取性别对应的项
  getProjectsByGrade: "/randomTestManagement/randomTestRelease/getProjectsByGrade", // 抽测发布-根据年级获取抽测项目
  getSchoolList: "/randomTestManagement/randomTestDistrictManagement/randomTest/getSchoolList",
  getRandomTestClassListByIdAndSchool: "/randomTestManagement/randomTestDistrictManagement/randomTest/getRandomTestClassListByIdAndSchool",
  addRandomTestClass: "/randomTestManagement/randomTestDistrictManagement/randomTest/addRandomTestClass",
  delRandomTestClass: "/randomTestManagement/randomTestDistrictManagement/randomTest/delRandomTestClass",
  randomTestDataUpdate: "randomTestManagement/randomTestDistrictManagement/randomTestData/update"
};

export function randomTestDataUpdate(parameter: any) {
  return request({
    url: api.randomTestDataUpdate,
    method: "POST",
    data: parameter
  });
}

export function delRandomTestClass(parameter: any) {
  return request({
    url: api.delRandomTestClass,
    method: "POST",
    data: parameter
  });
}

export function addRandomTestClass(parameter: any) {
  return request({
    url: api.addRandomTestClass,
    method: "POST",
    data: parameter
  });
}

export function getRandomTestClassListByIdAndSchool(parameter: any) {
  return request({
    url: api.getRandomTestClassListByIdAndSchool,
    method: "GET",
    params: parameter
  });
}

export function getSchoolList(parameter: any) {
  return request({
    url: api.getSchoolList,
    method: "GET",
    params: parameter
  });
}

export function getProjectsByGrade(parameter: any) {
  return request({
    url: api.getProjectsByGrade,
    method: "GET",
    params: parameter
  });
}

export function getProjectsByGender(parameter: any) {
  return request({
    url: api.getProjectsByGender,
    method: "GET",
    params: parameter
  });
}

export function getResults(parameter: any) {
  return request({
    url: api.getResults,
    method: "POST",
    data: parameter,
    loading: true
  });
}

export function getRandomTestById(parameter: any) {
  return request({
    url: api.getRandomTestById,
    method: "GET",
    params: parameter
  });
}

export function randomTestDataList(parameter: any) {
  return request({
    url: api.randomTestDataList,
    method: "GET",
    params: parameter,
    loading: true
  });
}

export function randomTestDataImport(parameter: any) {
  return request({
    url: api.randomTestDataImport,
    method: "POST",
    data: parameter,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    loading: true
  });
}

export function randomTestDataExport(parameter: object) {
  return request({
    url: api.randomTestDataExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: object) => download(response, "抽测管理信息.xls"));
}

export function randomTestDataDownloadTemplate(parameter: any) {
  return request({
    url: api.randomTestDataDownloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: object) => download(response, "成绩登记卡.xls"));
}

export function downloadScoreCardTemplate(parameter: any) {
  return request({
    url: api.downloadScoreCardTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "成绩登记卡.zip"));
}

export function randomTestRelease(parameter: object, update = false) {
  return request({
    url: update ? api.update : api.randomTestRelease,
    method: "POST",
    data: parameter
  });
}

export function update(parameter: any) {
  return request({
    url: api.update,
    method: "POST",
    data: parameter
  });
}

export function downloadTemplate(parameter: any) {
  return request({
    url: api.downloadTemplate,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "抽测管理信息模板.xls"));
}

export function randomTestExport(parameter: any) {
  return request({
    url: api.randomTestExport,
    method: "GET",
    params: parameter,
    responseType: "blob",
    loading: true
  }).then((response: any) => download(response, "抽测管理信息.xls"));
}

export function randomTestImport(parameter: any) {
  return request({
    url: api.randomTestImport,
    method: "POST",
    data: parameter,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export function randomtestList(parameter: any) {
  return request({
    url: api.randomtestList,
    method: "GET",
    params: parameter,
    loading: true
  });
}

export function randomTestResult(parameter: any) {
  return request({
    url: api.randomTestResult,
    method: "GET",
    params: parameter
  });
}
