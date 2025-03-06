<script setup lang="ts">
import type { Tables } from '~/database/types';

const props = defineProps<{
  list: Partial<Tables<'trello_lists'>>;
}>();

const trelloStore = useTrelloStore();
const dialogVisible = ref(false);

const handleEdit = () => (dialogVisible.value = true);

const handleDelete = async () => {
  ElMessageBox.confirm(`確認要刪除 ${props.list.name} 列表？`, '刪除確認', {
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await trelloStore.deleteTrelloLists(props.list.id!);
  });
};
</script>

<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <Icon class="app-icon" name="material-symbols:list-rounded" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleEdit">編輯列表</el-dropdown-item>
        <el-dropdown-item @click="handleDelete">刪除</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <TrelloDialogEditList v-model="dialogVisible" :list />
</template>

<style scoped></style>
