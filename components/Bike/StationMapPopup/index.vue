<script setup lang="ts">
import { type BikeStationWithAvailability } from '~/types/tdx';

const props = defineProps<{
  station: BikeStationWithAvailability;
}>();

const bikeStore = useBikeStore();

const { status: addStatus, execute: addFavor } = useAsyncData(
  'add-favorite',
  () => bikeStore.addBikeFavorite(props.station.StationID),
  { immediate: false }
);

const { status: removeStatus, execute: removeFavor } = useAsyncData(
  'remove-favorite',
  () => bikeStore.removeBikeFavorite(props.station.StationID),
  { immediate: false }
);

const isFetch = computed(
  () => addStatus.value === 'pending' || removeStatus.value === 'pending'
);

async function handleFavorite() {
  if (props.station.isFavor) {
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
  <LPopup>
    <div class="leading-normal">
      <div class="text-[14px] flex items-center relative">
        <AppLoading
          class="!bg-white !bg-opacity-50"
          :showLoader="false"
          v-if="isFetch"
        />

        <BikeStationFavorIcon
          :active="station.isFavor ?? false"
          labelPosition="left"
          @click.stop="handleFavorite"
        />
        <div class="ml-1">
          {{ splitStationName(station.StationName.Zh_tw) }}
        </div>
      </div>
    </div>
  </LPopup>
</template>

<style scoped></style>
