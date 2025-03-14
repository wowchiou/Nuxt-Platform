<script setup lang="ts">
import type { SetLoadingFunc } from '~/types/trello';

const trelloStore = useTrelloStore();
const { trelloProjects } = storeToRefs(trelloStore);
const trelloLoading = ref(false);

const { status, execute } = useAsyncData(
  'trello-projects',
  trelloStore.setTrello,
  {
    immediate: false,
  }
);

if (!trelloProjects.value.length) {
  await execute();

  const projectID = useRoute().params.projectID as string;
  const isExistsProject = trelloProjects.value.find(
    (itm) => itm.id === projectID
  );

  if (isExistsProject) {
    trelloStore.setActiveTrello(projectID);
    await execute();
  } else {
    navigateTo('/trello');
    ElNotification.warning({ message: '您尋找的頁面不存在！' });
  }
}

const setTrelloLoading: SetLoadingFunc = (val: boolean) => {
  trelloLoading.value = val;
};

provide('$trelloLoading', setTrelloLoading);
</script>

<template>
  <div class="flex-1">
    <TrelloFilter />

    <div class="relative">
      <AppLoading
        v-if="status === 'pending' || trelloLoading"
        :showLoader="false"
        class="!bg-opacity-30"
      />

      <el-scrollbar class="pb-5" always>
        <div class="py-5 flex-1">
          <div class="flex justify-start items-start min-h-[calc(100vh-190px)]">
            <TrelloCardGroup />
            <TrelloCardCreator />
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped></style>
