<script setup lang="ts">
const trelloStore = useTrelloStore();
const { trelloProjects, activeTrello } = storeToRefs(trelloStore);
const dialogVisible = ref(false);

const { status, execute } = useAsyncData(
  'trello-projects',
  trelloStore.setTrello,
  {
    immediate: false,
  }
);

(async () => {
  if (!activeTrello.value) {
    await execute();
    if (!trelloProjects.value.length) return;
    activeTrello.value = trelloProjects.value[0].id!;
  }
  navigateTo(`/trello/${activeTrello.value}`);
})();

const openDialog = () => {
  dialogVisible.value = true;
};
</script>

<template>
  <div class="pt-10 relative flex-1">
    <AppLoading v-if="activeTrello || status === 'pending'" />

    <div v-else class="max-w-[500px] m-auto text-center">
      <h2 class="text-xl fon-bold">建立第一個任務專案吧！</h2>
      <el-button class="mt-4" type="primary" @click="openDialog">
        創建任務專案
      </el-button>
    </div>
  </div>

  <TrelloDialogCreateProject v-model="dialogVisible" />
</template>

<style scoped></style>
