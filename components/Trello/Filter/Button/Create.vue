<script setup lang="ts">
const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};
</script>

<template>
  <div>
    <el-tooltip placement="top" content="創建新專案">
      <el-button type="primary" @click="openDialog">
        <Icon class="app-icon !opacity-100" name="material-symbols:add" />
      </el-button>
    </el-tooltip>

    <TrelloDialogCreateProject v-model="dialogVisible" />
  </div>
</template>

<style scoped></style>
