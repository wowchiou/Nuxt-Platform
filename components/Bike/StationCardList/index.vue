<script setup lang="ts">
import { useVirtualList } from '@vueuse/core';
import type { BikeStationWithAvailability } from '~/types/tdx';

const props = defineProps<{
  stations: BikeStationWithAvailability[];
  activeStation: BikeStationWithAvailability | null;
}>();

const emit = defineEmits<{
  (event: 'clickCard', station: BikeStationWithAvailability): void;
}>();

const bikeStations = computed(() => props.stations);

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  bikeStations.value,
  { itemHeight: 99 }
);

function handleClickCard(station: BikeStationWithAvailability) {
  emit('clickCard', station);
}

// watch(bikeStations, () => {
//   scrollTo(0);
// });
</script>

<template>
  <div v-bind="containerProps" class="flex-1 h-[99px]">
    <div v-bind="wrapperProps">
      <BikeStationCard
        v-for="bike in list"
        :key="`bike-card-${bike.data.StationUID}`"
        :bike="bike.data"
        :active="bike.data.StationUID === activeStation?.StationUID"
        @click="handleClickCard(bike.data)"
      />
    </div>
  </div>
</template>

<style scoped></style>
