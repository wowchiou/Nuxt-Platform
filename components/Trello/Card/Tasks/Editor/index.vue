<script setup lang="ts">
import type { Tables } from '~/database/types';

const props = defineProps<{
  task: Partial<Tables<'trello_tasks'>>;
}>();

const trelloStore = useTrelloStore();
const dialogVisible = ref(false);

const handleEdit = () => {
  dialogVisible.value = true;
};

const handleDelete = async () => {
  await trelloStore.deleteTrelloTasks(props.task.id!);
};
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <Icon class="app-icon" name="material-symbols:ink-pen-outline" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleEdit">編輯任務</el-dropdown-item>
        <el-dropdown-item @click="handleDelete">刪除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <TrelloDialogEditTask v-model="dialogVisible" :task />
</template>

<style scoped></style>
