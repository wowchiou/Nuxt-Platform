<script setup lang="ts">
import { type BikeStationWithAvailability } from '~/types/tdx';

const props = defineProps<{
  bikeStations: BikeStationWithAvailability[];
  mapLatLng: number[];
  zoom: number;
  activeStation: BikeStationWithAvailability | null;
  loading: boolean;
}>();

const emits = defineEmits<{
  (event: 'ready'): void;
}>();

const { userPosition } = storeToRefs(useAuthStore());
const { activeStation } = storeToRefs(useBikeStore());

const stations = computed(() => props.bikeStations);

function setActiveStation(station: BikeStationWithAvailability) {
  activeStation.value = station;
}

function onReady() {
  emits('ready');
}
</script>

<template>
  <div class="relative w-full h-full">
    <div v-if="loading" class="loading">
      <Icon class="text-4xl" name="line-md:loading-twotone-loop" />
    </div>

    <LMap
      class="absolute w-full h-full top-0 left-0"
      :zoom
      :center="[mapLatLng[0], mapLatLng[1]]"
      :use-global-leaflet="true"
      @ready="onReady"
    >
      <MapLayer />

      <LMarker
        v-if="userPosition"
        :lat-lng="[userPosition[0], userPosition[1]]"
      >
        <MapUserLocationIcon />
      </LMarker>

      <template v-if="stations.length">
        <LMarker
          v-for="bike in stations"
          :key="`bike-marker-${bike.StationUID}`"
          :lat-lng="[
            bike.StationPosition.PositionLat,
            bike.StationPosition.PositionLon,
          ]"
          @click="setActiveStation(bike)"
        >
          <BikeStationMapIcon
            :active="bike.StationUID === activeStation?.StationUID"
            :station="bike"
          />

          <BikeStationMapPopup :station="bike" />
        </LMarker>

        <BikeStationMapDetail v-if="activeStation" :station="activeStation" />
      </template>
    </LMap>
  </div>
</template>

<style scoped>
.loading {
  @apply !absolute !top-0 !left-0 !w-full !h-full !bg-slate-400 !bg-opacity-50 !flex !justify-center !items-center !z-[9999];
}
</style>
