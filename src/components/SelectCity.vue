<template>
  <el-select
    v-show="showItem.includes('province')"
    v-model="area.province"
    placeholder="请选择省份"
    class="mx-2 w-40"
    disabled
    @change="changeSelect(1)"
  >
    <el-option
      v-for="(value, key) in districts[100000]"
      :key="key"
      :label="value"
      :value="key"
    />
  </el-select>
  <el-select
    v-show="showItem.includes('city')"
    v-model="area.city"
    placeholder="请选择市"
    class="mx-3 w-40"
    disabled
    @change="changeSelect(2)"
  >
    <el-option
      v-for="(value, key) in districts[area.province]"
      :key="key"
      :label="value"
      :value="key"
    />
  </el-select>
  <el-select
    v-show="showItem.includes('district')"
    v-model="area.district"
    :disabled="!!$store.state.User?.userRoles?.schoolDistrict"
    :class="districtClass"
    class="mx-2 w-40"
    placeholder="请选择区县"
    @change="changeSelect"
  >
    <el-option
      v-for="(value, key) in districts[area.city]"
      :key="key"
      :label="value"
      :value="key"
    />
  </el-select>
</template>

<script>
import districts from "@/utils/city.js";
import { reactive } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    districtClass: {
      default: '',
      type: String
    },
    showItem: {
      default () {
        const {userRoles} = useStore().state.User
        if(userRoles) {

        }
        console.log(useStore())
        return ['district', 'city', 'province'] },
      type: Array
    },
    districtCode:{
      default() {
        return '';
      }
    },
    cityCode:{
      default() {
        return '';
      }
    },
    provinceCode:{
      default() {
        return '';
      }
    }
  },
  emits: ['changeSelectCity', 'update:districtCode','update:cityCode','update:provinceCode'],
  setup (props, context) {
    const store = useStore()
    console.log(store, 'store.state.User?.userRoles?.schoolDistrict')
    const area = reactive({
      province: '370000',
      city: '370100',
      district: props.districtCode?props.districtCode:store.state.User?.userRoles?.schoolDistrict??''
    })
    context.emit('update:districtCode', area.district)
    context.emit('update:cityCode', area.city)
    context.emit('update:provinceCode', area.province)
    context.emit('changeSelectCity', area)
    const changeSelect = (state) => {
      switch (state) {
        case 1:
          area.city = ''
          area.district = ''
          break
        case 2:
          area.district = ''
          break
      }
      context.emit('update:districtCode', area.district)
      context.emit('update:cityCode', area.city)
      context.emit('update:provinceCode', area.province)
      context.emit('changeSelectCity', area)
    }
    // defineExpose({
    //   area
    // })
    return {
      area,
      districts,
      changeSelect
    }
  },
  computed: {

  }
}
</script>

<style>
</style>
