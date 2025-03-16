<script setup lang="ts">
const weatherStore = useWeatherStore();
const { cityName } = storeToRefs(weatherStore);
</script>

<template>
  <div class="flex items-center">
    <div>選擇城市：</div>
    <el-select class="flex-1 max-w-[300px]" v-model="cityName" size="large">
      <el-option label="選擇城市" value="" disabled />
      <el-option
        v-for="city in CITY_LIST"
        :key="city.CityCode"
        :label="city.CityName"
        :value="city.CityName"
      />
    </el-select>
  </div>
</template>

<style scoped></style>
