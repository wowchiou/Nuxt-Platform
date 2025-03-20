<script setup lang="ts">
import type { BikeStationWithAvailability } from '~/types/tdx';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const bikeStore = useBikeStore();

const { userPosition, defaultPosition } = storeToRefs(authStore);
const { cityName, keyword, bikeCities, bikeStationsWithFavor, activeStation } =
  storeToRefs(bikeStore);

const isShowFavorites = ref(false);
provide('$isShowFavorites', isShowFavorites);

const mapLatLng = ref<number[]>(userPosition.value || defaultPosition.value);
const zoom = ref<number>(16);

const city = computed(() =>
  bikeCities.value.find((c) => c.City === cityName.value)
);

const stations = computed(() => {
  let ss = bikeStationsWithFavor.value;
  if (keyword.value) {
    ss = bikeStationsWithFavor.value.filter((s) =>
      s.StationName.Zh_tw.includes(keyword.value)
    );
  }
  if (isShowFavorites.value) {
    ss = ss.filter((s) => s.isFavor);
  }
  return ss;
});

const isFetch = computed(
  () => status.value === 'pending' || favorStatus.value === 'pending'
);

const { status, execute, error } = useAsyncData(
  'bike-stations',
  () => bikeStore.fetchBikeStations(cityName.value),
  { immediate: false }
);

const { status: favorStatus, execute: getFavor } = useAsyncData(
  'bike-favorite',
  bikeStore.fetchBikeFavorite,
  { immediate: false }
);

async function onMapReady() {
  if (userPosition.value) setMapPosition(userPosition.value);

  // 如store已有參數設置網址參數
  if (checkIsStoreHasData()) return;

  // 如網址有city參數取得該城市的YouBike站點
  cityName.value = (route.query.city as string) || '';
  if (cityName.value) {
    await fetchBikeStation();
    // 如網址有keyword參數搜尋站點
    keyword.value = (route.query.keyword as string) || '';
    if (keyword.value) searchBikeStation();
  }
}

function checkIsStoreHasData() {
  if (cityName.value) {
    setRouteQuery({ city: cityName.value });
    if (keyword.value) searchBikeStation();
    // 如已有選定站點定位到該經緯座標
    if (activeStation.value) {
      setMapPosition([
        activeStation.value.StationPosition.PositionLat,
        activeStation.value.StationPosition.PositionLon,
      ]);
      return true;
    }
    // 如有查詢城市定位到該經緯座標
    if (city.value) setMapPosition(city.value.latlng);
    return true;
  }
  return false;
}

async function fetchBikeStation() {
  await execute();
  await getFavor();
  if (error.value) return;
  keyword.value = '';
  activeStation.value = null;
  setRouteQuery({ city: cityName.value, keyword: '' });
  // 定位查詢的城市經緯座標
  if (!city.value) return;
  setMapPosition(city.value.latlng);
}

function searchBikeStation() {
  setRouteQuery({ keyword: keyword.value });
}

function setMapPosition(latlng: number[]) {
  mapLatLng.value = latlng;
}

function handleClickCard(bike: BikeStationWithAvailability) {
  const {
    StationPosition: { PositionLat, PositionLon },
  } = bike;
  activeStation.value = bike;
  setMapPosition([PositionLat, PositionLon]);
}

function setRouteQuery(query: Record<string, string>) {
  router.push({ query: { ...route.query, ...query } });
}

function handleShowFavorite() {
  isShowFavorites.value = !isShowFavorites.value;
}
</script>

<template>
  <div class="flex flex-1 rounded overflow-hidden">
    <div class="w-[280px] bg-white p-2 flex flex-col">
      <BikeStationSelector
        :loading="status === 'pending'"
        @change="fetchBikeStation"
      />

      <BikeStationFilter
        class="mt-2"
        :loading="status === 'pending'"
        @change="searchBikeStation"
      />

      <BikeStationFavorButton
        class="mt-2"
        :show="isShowFavorites"
        @click="handleShowFavorite"
      />

      <div
        v-if="stations.length"
        class="flex-1 basis-0 overflow-hidden flex flex-col"
      >
        <el-divider>{{ isShowFavorites ? '收藏' : 'YouBike' }}站點</el-divider>

        <BikeStationCardList
          :key="stations.length"
          :stations="stations"
          :activeStation="activeStation"
          :isShowFavorites="isShowFavorites"
          @clickCard="handleClickCard"
        />
      </div>

      <el-empty v-else :image-size="30" description="查無站點資料" />
    </div>

    <div class="flex flex-1 flex-col">
      <BikeStationMap
        :bikeStations="stations"
        :activeStation="activeStation"
        :mapLatLng="mapLatLng"
        :zoom="zoom"
        :loading="isFetch"
        @ready="onMapReady"
      />
    </div>
  </div>
</template>

<style scoped></style>
