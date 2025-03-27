<script setup lang="ts">
const route = useRoute();
const currentRoute = computed(() => route.path);

const defaultOpeneds = computed(() => APP_MENU_LIST.map((menu) => menu.title));
</script>

<template>
  <div class="border-r bg-white">
    <el-scrollbar>
      <el-menu
        :default-active="currentRoute"
        class="!border-none"
        :default-openeds="defaultOpeneds"
      >
        <el-sub-menu
          v-for="menu in APP_MENU_LIST"
          :key="`menu-list-${menu.title}`"
          class="select-none"
          :index="menu.title"
        >
          <template #title>
            <Icon
              v-if="menu.icon"
              class="app-icon relative -left-1"
              :name="menu.icon"
            />
            <span>{{ menu.title }}</span>
          </template>

          <template
            v-for="(sub, idx) in menu.children"
            :key="`sub-list-${index}-${idx}`"
          >
            <NuxtLink
              :to="sub.path"
              :class="{ 'current-route': route.path.startsWith(sub.path) }"
            >
              <el-menu-item class="!text-slate-400" :index="sub.path">
                {{ sub.title }}
              </el-menu-item>
            </NuxtLink>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>
/* :deep(.el-menu.el-menu--vertical) {
  @apply border-none;
} */

:deep(.current-route li) {
  @apply !text-blue-400;
}
</style>
