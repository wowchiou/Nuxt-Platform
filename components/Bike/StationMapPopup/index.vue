<script setup lang="ts">
import { BikeServiceType, type BikeStationWithAvailability } from '~/types/tdx';

defineProps<{
  station: BikeStationWithAvailability;
}>();

function splitStationName(name: string) {
  const n = name.split('_');
  if (n.length > 1) return n[1];
  return n[0];
}
</script>

<template>
  <LPopup :options="{ maxWidth: 300 }">
    <div class="leading-normal">
      <div class="text-[14px]">
        {{ splitStationName(station.StationName.Zh_tw) }}
      </div>
      <el-divider class="!my-1" />
      <div>{{ BikeServiceType[station.ServiceType] }}</div>
    </div>
  </LPopup>
</template>

<style scoped></style>
