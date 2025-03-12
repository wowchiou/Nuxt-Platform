<script setup lang="ts">
import { type BikeStationWithAvailability } from '~/types/tdx';

const props = defineProps<{
  bikeStations: BikeStationWithAvailability[];
  mapLatLng: number[];
  zoom: number;
  activeStation: BikeStationWithAvailability | null;
}>();

const emits = defineEmits<{
  (event: 'ready'): void;
}>();

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
  <LMap
    :zoom
    :center="[mapLatLng[0], mapLatLng[1]]"
    :use-global-leaflet="true"
    @ready="onReady"
  >
    <MapLayer />

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
</template>

<style scoped></style>
