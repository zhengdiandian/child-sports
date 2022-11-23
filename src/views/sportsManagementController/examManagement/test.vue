<script lang="tsx">

import { Component, Mut, VueComponent } from "vue3-oop";
import { useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { Gender } from "@/utils/baseData";
import RouterStart from "@/router/router.service";
import { list } from "@/api/examData";
import { ListOfExamData } from "@/interface/examData";
// import { ListOfExamData } from "@/interface/examData";
// import { ExamId, ListOfExamData } from "@/interface/examData";
import Table from "@/service/table";

// import "@/styles/element/index.scss";

// const { schoolexamId }: any = route.query ?? "";
@Component()
export default class ExamInfo extends VueComponent {
  constructor(private RouterStart: RouterStart, private table: Table) {
    super();
    const route = useRoute();
    const { schoolexamId }: any = route.query ?? undefined;
    this.formData.schoolexamId = Number.parseInt(schoolexamId);
    this.getData();
    console.log(schoolexamId);
  }

  @Mut() formData = ({
    fuzzyQuery: "",
    pageNum: 1,
    pageSize: 1,
    schoolexamId: 11,
    studentGender: undefined,
    className: ""
  });
  getData = () => {
    console.log(this.table);
    list(this.formData as ListOfExamData).then(({ data }) => {
      this.table.list = data.list;
    });
  };

  render() {
    // const slots = {
    //   prefix
    // };
    return (
      <div>
        <h3 class="text-xl text-black font-semibold">学生成绩详情</h3>

        <div class="space-x-6 nowrap ">

          <div class="inline-block text-black">
            性别：
            <el-checkbox-group class="inline-block" v-model={this.formData.schoolexamGrade}>
              {Gender.map(({ label, value }) => value !== 0 ? <el-checkbox key={label} label={value}
              >{label}</el-checkbox> : null)}
            </el-checkbox-group>
          </div>
          <el-select v-model={this.formData.className}>
            <el-option value={"xxx"}>xxx</el-option>
          </el-select>
          <el-input
            v-model={this.formData.fuzzyQuery}
            class="w-52"
            placeholder="请输入查询内容"
            prefix-icon={Search}
          >
            /* {{
            prefix: () => <el-icon className="el-input__icon red-100">
              <Search />
            </el-icon>
          }}*/


          </el-input>
          <el-button class="rounded w-0" type="primary" onclick={this.getData} icon={Search}>
            搜索

          </el-button>
        </div>

        <el-table
          border={true}
          class="w-full"
          data={this.table.list}

          header-cell-style={{ background: "#3470D0", color: "white" }}>

          <el-table-column
            align="center"
            label="序号"
            prop="schoolexamId"
            width="60"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="测试时间"
            prop="schoolexamDate"
            show-overflow-tooltip
            width="180px"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="班级"
            prop="className"
            show-overflow-tooltip
            width="180px"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="姓名"
            prop="studentName"
            show-overflow-tooltip
            width="180px"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="性別"
            prop="studentGender"
            show-overflow-tooltip
            width="180px"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="是否免测"
            prop="testFree"
            show-overflow-tooltip
            width="180px"
          >
            {{ default: (scope: boolean) => <h1>{scope}</h1> }}
          </el-table-column>
          <el-table-column
            align="center"
            class-name="text-black"
            label="总分"
            prop="studentGender"
            show-overflow-tooltip
            width="180px"
          />
          <el-table-column
            align="center"
            class-name="text-black"
            label="身高（CM）"
            prop="studentGender"
            show-overflow-tooltip
            width="180px"
          />


        </el-table>


      </div>

    );

  }

}

</script>

