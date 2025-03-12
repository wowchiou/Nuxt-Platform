<script setup lang="ts">
import type { BikeStationWithAvailability } from '~/types/tdx';
import type { ScrollbarInstance } from 'element-plus';

// 獲取使用者位置
const geo = await getUserPosition();
if (!geo) rejectGeo();

const router = useRouter();
const route = useRoute();
const bikeStore = useBikeStore();
const { cityName, keyword, bikeCities, bikeStations, activeStation } =
  storeToRefs(bikeStore);

const stations = ref(bikeStations.value);
const mapLatLng = ref<number[]>(geo || [25.0329694, 121.5654177]);
const zoom = ref<number>(16);
const scrollbarRef = ref<ScrollbarInstance | null>(null);

const city = computed(() =>
  bikeCities.value.find((c) => c.City === cityName.value)
);

const { status, execute } = useAsyncData(
  'bike-stations',
  () => bikeStore.fetchBikeStations(cityName.value),
  { immediate: false }
);

onMounted(async () => {
  // 如store已有參數設置網址參數
  if (cityName.value) {
    setRouteQuery({ city: cityName.value });
    if (keyword.value) searchBikeStation();
    if (city.value) setMapPosition(city.value.latlng);
    return;
  }

  // 如網址有city參數取得該城市的YouBike站點
  cityName.value = (route.query.city as string) || '';
  if (cityName.value) await fetchBikeStation();

  // 如網址有keyword參數搜尋站點
  keyword.value = (route.query.keyword as string) || '';
  searchBikeStation();
});

async function fetchBikeStation() {
  keyword.value = '';
  await execute();
  setRouteQuery({ city: cityName.value, keyword: '' });
  stations.value = bikeStations.value;
  // 定位查詢的城市經緯座標
  if (!city.value) return;
  setMapPosition(city.value.latlng);
  scrollToTop();
}

function searchBikeStation() {
  if (!keyword.value) {
    stations.value = bikeStations.value;
  } else {
    stations.value = bikeStations.value.filter((s) =>
      s.StationName.Zh_tw.includes(keyword.value)
    );
  }
  setRouteQuery({ keyword: keyword.value });
  scrollToTop();
}

function setMapPosition(latlng: number[], z = 16) {
  mapLatLng.value = latlng;
  // zoom.value = z;
}

function handleClickCard(bike: BikeStationWithAvailability) {
  const { StationPosition } = bike;
  activeStation.value = bike;
  setMapPosition(
    [StationPosition.PositionLat, StationPosition.PositionLon],
    18
  );
}

function rejectGeo() {
  ElNotification({
    title: '提醒',
    message: '已關閉定位功能，如要開啟請至瀏覽器設定開啟',
    type: 'warning',
  });
}

function setRouteQuery(query: Record<string, string>) {
  router.push({ query: { ...route.query, ...query } });
}

function scrollToTop() {
  nextTick(() => scrollbarRef.value?.scrollTo({ top: 0 }));
}
</script>

<template>
  <KeepAlive>
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

        <!-- <div class="mt-2">
          <el-button>
            <Icon class="app-icon" name="material-symbols:delete-history" />
          </el-button>
          <el-button>
            <Icon class="app-icon" name="material-symbols:favorite" />
          </el-button>
        </div> -->

        <div
          v-if="stations.length"
          class="flex-1 basis-0 overflow-hidden flex flex-col"
        >
          <el-divider>YouBike站點</el-divider>
          <el-scrollbar ref="scrollbarRef" class="flex-1">
            <BikeStationCard
              v-for="bike in stations"
              :key="`bike-card-${bike.StationUID}`"
              :bike="bike"
              :active="bike.StationUID === activeStation?.StationUID"
              @click="handleClickCard(bike)"
            />
          </el-scrollbar>
        </div>
        <el-empty v-else :image-size="30" description="查無站點資料" />
      </div>

      <div class="flex flex-1 flex-col">
        <ClientOnly>
          <BikeStationMap
            :bikeStations="stations"
            :activeStation="activeStation"
            :mapLatLng="mapLatLng"
            :zoom="zoom"
          />
        </ClientOnly>
      </div>
    </div>
  </KeepAlive>
</template>

<style scoped></style>
