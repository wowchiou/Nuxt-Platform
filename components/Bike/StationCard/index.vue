<script setup lang="ts">
import {
  BikeServiceType,
  BikeServiceStatus,
  type BikeStationWithAvailability,
} from '~/types/tdx';

const props = defineProps<{
  bike: BikeStationWithAvailability;
  active: boolean;
}>();

const isShowFavorites = inject<boolean>('$isShowFavorites', false);

const bikeStore = useBikeStore();

const { status: addStatus, execute: addFavor } = useAsyncData(
  'add-favorite',
  () => bikeStore.addBikeFavorite(props.bike.StationID),
  { immediate: false }
);

const { status: removeStatus, execute: removeFavor } = useAsyncData(
  'remove-favorite',
  () => bikeStore.removeBikeFavorite(props.bike.StationID),
  { immediate: false }
);

const bikeStation = computed(() => props.bike);

const isFetch = computed(
  () => addStatus.value === 'pending' || removeStatus.value === 'pending'
);

async function handleFavorite() {
  if (props.bike.isFavor) {
    await removeFavor();
    return;
  }
  await addFavor();
}

function splitStationName(name: string) {
  const n = name.split('_');
  if (n.length > 1) return n[1];
  return n[0];
}
</script>

<template>
  <div
    class="relative first:mt-0 mt-2 border p-2 cursor-pointer rounded shadow-sm hover:border-blue-400"
    :class="{ active }"
  >
    <AppLoading
      class="!bg-white !bg-opacity-50"
      :showLoader="false"
      v-if="isFetch"
    />

    <div class="text-[14px] flex justify-between items-start">
      <div class="truncate">
        {{ splitStationName(bikeStation.StationName.Zh_tw) }}
      </div>
      <BikeStationFavorIcon
        v-if="isShowFavorites"
        :active="bikeStation.isFavor ?? false"
        labelPosition="right"
        @click.stop="handleFavorite"
      />
    </div>

    <el-divider class="!my-2" />

    <div class="text-[12px] flex justify-start items-center">
      <div
        class="text-red-500"
        :class="{
          '!text-green-500': bikeStation.availability.ServiceStatus === 1,
        }"
      >
        {{ BikeServiceStatus[bikeStation.availability.ServiceStatus] }}
      </div>
      <div class="ml-2 text-gray-400">
        {{ BikeServiceType[bikeStation.ServiceType] }}
      </div>
    </div>

    <div
      class="text-[14px] mt-1 text-gray-500 flex justify-start items-center gap-x-4"
    >
      <div
        :class="{
          'text-red-500': bikeStation.availability.AvailableRentBikes === 0,
        }"
      >
        可借：{{ bikeStation.availability.AvailableRentBikes }}
      </div>
      <div
        :class="{
          'text-red-500': bikeStation.availability.AvailableReturnBikes === 0,
        }"
      >
        可還：{{ bikeStation.availability.AvailableReturnBikes }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.active {
  @apply !border-blue-400;
}
</style>
