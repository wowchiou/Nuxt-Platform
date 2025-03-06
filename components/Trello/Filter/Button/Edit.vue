<script setup lang="ts">
const trelloStore = useTrelloStore();
const { trelloProjects, activeTrello } = storeToRefs(trelloStore);

const dialogVisible = ref(false);
const project = ref(
  trelloProjects.value.find((project) => project.id === activeTrello.value)
);

const openDialog = () => {
  dialogVisible.value = true;
};

const handleDelete = () => {
  ElMessageBox.confirm(`確認要刪除 ${project.value?.name} 專案？`, '刪除確認', {
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await trelloStore.deleteTrelloProjects(activeTrello.value);
    trelloStore.setActiveTrello(trelloProjects.value[0]?.id! || '');
    ElMessage({
      type: 'success',
      message: '成功刪除專案',
    });
    navigateTo('/trello');
  });
};
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <el-button @click="">
        <Icon class="app-icon" name="material-symbols:list-rounded" />
      </el-button>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog">編輯專案</el-dropdown-item>
        <el-dropdown-item @click="handleDelete">刪除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <TrelloDialogEditProject v-model="dialogVisible" />
</template>

<style scoped></style>
