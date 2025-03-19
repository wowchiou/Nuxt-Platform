<script setup lang="ts">
defineProps<{
  active: boolean;
  labelPosition: 'left' | 'right' | 'top' | 'bottom';
}>();
</script>

<template>
  <div class="flex items-center">
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="active ? '取消收藏' : '加入收藏'"
      :placement="labelPosition"
    >
      <Icon
        class="app-icon cursor-pointer hover"
        :class="{ 'text-red-500': active }"
        :name="
          active
            ? 'material-symbols:favorite'
            : 'material-symbols:favorite-outline'
        "
      />
    </el-tooltip>
  </div>
</template>

<style scoped></style>
