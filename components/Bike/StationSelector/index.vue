<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();

const emits = defineEmits<{
  (event: 'change'): void;
}>();

const bikeStore = useBikeStore();
const { bikeCities, cityName } = storeToRefs(bikeStore);
</script>

<template>
  <el-select
    v-model="cityName"
    placeholder="請選擇城市"
    :disabled="loading"
    @change="emits('change')"
  >
    <el-option label="選擇城市" value="" disabled />
    <el-option
      v-for="city in bikeCities"
      :key="`city-${city.CityCode}`"
      :label="city.CityName"
      :value="city.City"
    />
  </el-select>
</template>

<style scoped></style>
