export const formatData = (data, type) => {
  // const keys  = Object.keys(data)
  const chartData: any = {
    // test: {"不及格":1.41,"优秀":3.41,"及格":64.86,"良好":1.32,"未完成率":0,"avrScore":0}
  };
  if (type === 0) {
    for (const a of data) {
      chartData[a.name] = {
        // 'avrScore': a.avgscore,
        "不及格": a.noPassRate,
        "优秀": a.excellentRate,
        "及格": a.passRate,
        "良好": a.goodRate,
        "未完成": a.undoneRate
      };
    }
  } else {
    for (const a of data) {
      chartData[a.name] = {
        // 'avrScore': a.avgscore,
        "低体重": a.lowWeightRate,
        "正常": a.normalRate,
        "超重": a.overweightRate,
        "肥胖": a.fatRate,
        "未完成": a.undoneRate
      };
    }
  }

  console.log("chart数据", chartData);
  return chartData;
};
