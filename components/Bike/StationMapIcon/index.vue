<script setup lang="ts">
import type { BikeStationWithAvailability } from '~/types/tdx';

defineProps<{
  active: boolean;
  station: BikeStationWithAvailability;
}>();
</script>

<template>
  <LIcon class-name="" :iconSize="[35, 35]">
    <div
      class="w-[35px] h-[35px] border-2 border-grey-600 rounded-[50%] -translate-x-[4%] p-[1px]"
      :class="{
        active: active,
        'border-red-500': station.availability.AvailableRentBikes === 0,
        'border-green-500': station.availability.ServiceStatus === 1,
      }"
    >
      <div
        class="bg-white bg-opacity-80 h-full rounded-[50%] flex justify-center items-center"
        :class="{ '!bg-blue-500 !bg-opacity-100': active }"
      >
        <Icon
          class="app-icon text-grey-600"
          name="material-symbols:directions-bike"
        />
      </div>
    </div>
  </LIcon>
</template>

<style scoped>
.active {
  @apply !border-blue-500;
}
.active .app-icon {
  @apply !text-white;
}
</style>
