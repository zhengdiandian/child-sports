import { ref } from "vue";

export const handleSizeChange = (val: number, cb: Function) => {
  debugger;
  // cb()
  // this.state.value.pageSize = val
  console.log(`${val} items per page`);
};
export const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
export const pageSizes = [10, 20, 30, 50, 100, 200];
export const pageSize = ref(10);
export const pageNum = ref(1);
