<script setup lang="ts">
import L from 'leaflet';
import { type BikeStationWithAvailability } from '~/types/tdx';

// 不載入預設的leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

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

const authStore = useAuthStore();
const { userPosition } = storeToRefs(authStore);
const { activeStation } = storeToRefs(useBikeStore());
const isGeoReady = ref(false);
const showMap = ref(false);
const geo = ref();

const stations = computed(() => props.bikeStations);

onMounted(async () => {
  // 獲取使用者位置
  geo.value = await getUserPosition();
  // 確保leaflet是在client端載入
  showMap.value = true;
});

function setActiveStation(station: BikeStationWithAvailability) {
  activeStation.value = station;
}

async function onReady() {
  isGeoReady.value = true;
  if (!geo.value) {
    rejectGeo();
  } else {
    authStore.setUserPosition(geo.value);
  }
  emits('ready');
}

function rejectGeo() {
  ElNotification({
    title: '提醒',
    message: '已關閉定位功能，如要開啟請至瀏覽器設定開啟',
    type: 'warning',
  });
}
</script>

<template>
  <div class="relative w-full h-full bg-gray-300">
    <AppLoading v-if="loading || !isGeoReady" />

    <LMap
      v-if="showMap"
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
