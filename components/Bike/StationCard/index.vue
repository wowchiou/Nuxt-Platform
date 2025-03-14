<script setup lang="ts">
import {
  BikeServiceType,
  BikeServiceStatus,
  type BikeStationWithAvailability,
} from '~/types/tdx';

defineProps<{
  bike: BikeStationWithAvailability;
  active: boolean;
}>();

function splitStationName(name: string) {
  const n = name.split('_');
  if (n.length > 1) return n[1];
  return n[0];
}
</script>

<template>
  <div
    class="first:mt-0 mt-2 border p-2 cursor-pointer rounded shadow-sm hover:border-blue-400"
    :class="{ active }"
  >
    <div class="text-[14px]">
      {{ splitStationName(bike.StationName.Zh_tw) }}
    </div>

    <el-divider class="!my-2" />

    <div class="text-[12px] flex justify-start items-center">
      <div
        class="bg-red-500 rounded-full px-2 py-[1px] text-white"
        :class="{
          '!bg-green-500': bike.availability.ServiceStatus === 1,
        }"
      >
        {{ BikeServiceStatus[bike.availability.ServiceStatus] }}
      </div>
      <div class="ml-1 text-gray-400">
        {{ BikeServiceType[bike.ServiceType] }}
      </div>
    </div>

    <div
      class="text-[14px] mt-1 text-gray-500 flex justify-start items-center gap-x-4"
    >
      <div
        :class="{ 'text-red-500': bike.availability.AvailableRentBikes === 0 }"
      >
        可借：{{ bike.availability.AvailableRentBikes }}
      </div>
      <div
        :class="{
          'text-red-500': bike.availability.AvailableReturnBikes === 0,
        }"
      >
        可還：{{ bike.availability.AvailableReturnBikes }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.active {
  @apply !border-blue-400;
}
</style>
