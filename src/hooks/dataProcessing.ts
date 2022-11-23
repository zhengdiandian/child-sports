export default (row: any, column: any, value = "value") => {
  if (row.projectData[column.rawColumnKey][value] === null) return "--";
  if (row.projectData[column.rawColumnKey][value] === "") return 0;
  if (row.projectData[column.rawColumnKey]?.projectName.includes("次")) return row.projectData[column.rawColumnKey][value];
  if (["800米跑(秒)", "1000米跑(秒)", "50米×8往返跑(秒)"].includes(column.label)) {
    let second: number | string = row.projectData[column.rawColumnKey][value] % 60;

    const minute = (row.projectData[column.rawColumnKey][value] - second) / 60;
    if (second < 10) {
      second = "0" + second;
    }
    return `${minute}'${second}‘’`;
  }

  try {
    return row.projectData[column.rawColumnKey][value]?.toFixed(2);

  } catch (e) {
    return row.projectData[column.rawColumnKey][value];
  }

}
