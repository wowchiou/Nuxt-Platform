<script setup lang="ts">
const trelloStore = useTrelloStore();
const { trelloProjects } = storeToRefs(trelloStore);

if (!trelloProjects.value.length) {
  await trelloStore.setTrello();

  const projectID = useRoute().params.projectID as string;
  const isExistsProject = trelloProjects.value.find(
    (itm) => itm.id === projectID
  );

  if (isExistsProject) {
    trelloStore.setActiveTrello(projectID);
    await trelloStore.setTrello();
  } else {
    navigateTo('/trello');
    ElNotification.warning({ message: '您尋找的頁面不存在！' });
  }
}
</script>

<template>
  <div>
    <TrelloFilter />

    <el-scrollbar class="pb-5" always>
      <div class="py-5 flex-1">
        <div class="flex justify-start items-start min-h-[calc(100vh-190px)]">
          <TrelloCardGroup />
          <TrelloCardCreator />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
