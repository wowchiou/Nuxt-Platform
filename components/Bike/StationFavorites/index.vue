<script setup lang="ts">
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus';

const lists = ref([
  {
    cityName: '台北市',
    stationName: '台北101',
    order: 1,
  },
  {
    cityName: '桃園市',
    stationName: '桃園國際機場',
    order: 2,
  },
  {
    cityName: '新竹市',
    stationName: '台積電',
    order: 3,
  },
]);
</script>

<template>
  <VueDraggable v-model="lists" ghost-class="ghost">
    <div
      v-for="itm in lists"
      :key="itm.stationName"
      class="text-[14px] flex items-center p-2 border-b last:border-b-0"
    >
      <div class="flex-1 flex items-center cursor-pointer hover">
        <div class="text-[12px] pr-1">{{ itm.cityName }}</div>
        <div class="flex-1 border-l-[1px] border-slate-300 pl-1">
          {{ itm.stationName }}
        </div>
      </div>

      <div class="flex items-center gap-x-2">
        <Icon class="app-icon cursor-move hover" name="material-symbols:sort" />
        <Icon
          class="app-icon cursor-pointer hover"
          name="material-symbols:delete-forever"
        />
      </div>
    </div>
  </VueDraggable>
</template>

<style scoped>
.hover {
  @apply hover:text-blue-500;
}
.ghost {
  @apply bg-blue-400 text-white;
}
</style>
