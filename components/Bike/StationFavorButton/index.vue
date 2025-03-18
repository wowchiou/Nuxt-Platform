<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div class="mt-2">
    <el-button class="w-full">
      <div class="flex items-center">
        <template v-if="!show">
          <Icon class="app-icon" name="material-symbols:favorite-outline" />
          <div class="ml-1">我的收藏站點</div>
        </template>

        <template v-else>
          <Icon class="app-icon" name="material-symbols:keyboard-return" />
          <div class="ml-1">返回站點列表</div>
        </template>
      </div>
    </el-button>
  </div>
</template>

<style scoped></style>
