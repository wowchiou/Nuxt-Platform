<script setup lang="ts">
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus';
import type { SetLoadingFunc } from '~/types/trello';

const setTrelloLoading = inject<SetLoadingFunc>('$trelloLoading', () => {});

const trelloStore = useTrelloStore();
const { trelloLists } = storeToRefs(trelloStore);
const lists = ref(trelloLists.value);
const newGroupIDX = ref<number | null>(null);
const oldGroupIDX = ref<number | null>(null);

const { status, execute } = useAsyncData(
  'set-trello-group',
  async () => {
    if (newGroupIDX.value === null || oldGroupIDX.value === null) return;
    await trelloStore.updateTrelloListsOrder(
      newGroupIDX.value!,
      oldGroupIDX.value!
    );
  },
  {
    immediate: false,
  }
);

const onUpdate = async (e: SortableEvent) => {
  const { newIndex, oldIndex } = e;
  newGroupIDX.value = newIndex as number;
  oldGroupIDX.value = oldIndex as number;
  await execute();
};

watch(trelloLists, (newVal) => {
  lists.value = newVal;
});

watch(status, (val) => {
  setTrelloLoading(val === 'pending');
});
</script>

<template>
  <VueDraggable
    v-if="lists"
    class="flex items-start"
    ref="list"
    v-model="lists"
    group="task-group"
    ghostClass="group-ghost"
    :animation="150"
    handle=".handle"
    :disabled="status === 'pending'"
    @update="onUpdate"
  >
    <TrelloCard
      class="mr-2"
      v-for="item in lists"
      :data-id="item.id"
      :key="`trello-group-${item.id}`"
    >
      <div class="task-header" :class="{ 'cursor-move': status !== 'pending' }">
        <div class="task-name handle">
          <p class="ml-2 truncate flex-1 text-[14px] py-1">
            {{ item.name }}
          </p>
        </div>
        <div class="flex justify-end items-center">
          <TrelloCardEditor class="cursor-pointer" :list="item" />
        </div>
      </div>

      <TrelloCardTasks class="flex flex-col gap-y-2 mt-2" :listID="item.id!" />

      <TrelloCardTasksCreator class="mt-5" :listID="item.id!" />
    </TrelloCard>
  </VueDraggable>
</template>

<style scoped>
.group-ghost {
  @apply bg-blue-400 text-white;
}

.task-header {
  @apply flex justify-between items-center overflow-hidden;
}

.task-name {
  @apply w-[calc(100%-25px)] flex items-center duration-300 rounded-sm hover:bg-blue-400 hover:bg-opacity-10;
}
</style>
