<script setup lang="ts">
import {
  BikeServiceType,
  BikeServiceStatus,
  type BikeStationWithAvailability,
} from '~/types/tdx';

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
  <LControl position="topright">
    <div class="w-[250px] bg-white p-3 text-[14px] rounded shadow-sm">
      <div class="text-[16px] font-bold">
        {{ splitStationName(station.StationName.Zh_tw) }}
      </div>
      <div class="flex justify-between items-center">
        <div
          class="text-green-500"
          :class="{ 'text-red-500': station.availability.ServiceStatus !== 1 }"
        >
          {{ BikeServiceStatus[station.availability.ServiceStatus] }}
        </div>
        <div>{{ BikeServiceType[station.ServiceType] }}</div>
      </div>

      <el-divider class="!my-1" />
      <div>{{ station.StationAddress.Zh_tw }}</div>

      <div class="mt-1 text-gray-400">
        <div>
          一般自行車可租借車數：{{
            station.availability.AvailableRentBikesDetail.GeneralBikes
          }}
        </div>
        <div>
          電動輔助車可租借車數：{{
            station.availability.AvailableRentBikesDetail.ElectricBikes
          }}
        </div>
      </div>

      <el-divider class="!my-1" />
      <div class="flex justify-between items-center">
        <div
          :class="{
            'text-red-500': station.availability.AvailableRentBikes === 0,
          }"
        >
          可借車位：{{ station.availability.AvailableRentBikes }}
        </div>
        <div
          :class="{
            'text-red-500': station.availability.AvailableReturnBikes === 0,
          }"
        >
          可還車位：{{ station.availability.AvailableReturnBikes }}
        </div>
      </div>
    </div>
  </LControl>
</template>

<style scoped></style>
