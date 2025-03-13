<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import type { SortableEvent } from 'vue-draggable-plus';
import type { DragTaskAddData } from '~/types/trello';

const props = defineProps<{
  listID: string;
}>();

const trelloStore = useTrelloStore();
const { trelloLists } = storeToRefs(trelloStore);

const newTaskIDX = ref<number | null>(null);
const oldTaskIDX = ref<number | null>(null);

const tasks = computed(() => {
  return trelloLists.value.find((list) => list.id === props.listID)
    ?.trello_tasks;
});

const { status, execute } = useAsyncData(
  'set-trello-tasks',
  async () => {
    if (newTaskIDX.value === null || oldTaskIDX.value === null) return;
    await trelloStore.updateTrelloTasksOrder({
      listID: props.listID,
      newIndex: newTaskIDX.value,
      oldIndex: oldTaskIDX.value,
    });
  },
  {
    immediate: false,
  }
);

const onUpdate = async (e: SortableEvent) => {
  const { newIndex, oldIndex } = e;
  newTaskIDX.value = newIndex as number;
  oldTaskIDX.value = oldIndex as number;
  await execute();
};

const onAdd = async (e: SortableEvent) => {
  const addInfo = {
    toID: e.to.parentElement!.dataset.id,
    toIndex: e.newIndex,
    fromID: e.from.parentElement!.dataset.id,
    fromIndex: e.oldIndex,
  };
  await trelloStore.updateTrelloTasksOverCross(addInfo as DragTaskAddData);
};
</script>

<template>
  <VueDraggable
    v-if="tasks"
    class="flex flex-col gap-y-2 mt-2"
    :ref="listID"
    v-model="tasks"
    group="trello-tasks"
    :animation="150"
    ghostClass="task-ghost"
    handle=".handle"
    :disabled="status === 'pending'"
    @add="onAdd"
    @update="onUpdate"
  >
    <div class="task-card" v-for="task in tasks" :key="`task-${task.id}`">
      <p
        class="break-all flex-1 handle"
        :class="{ 'cursor-move': status !== 'pending' }"
      >
        {{ task.name }}
      </p>
      <TrelloCardTasksEditor :task />
    </div>
  </VueDraggable>
</template>

<style scoped>
.task-ghost {
  @apply !bg-blue-400 text-white;
}

.task-card {
  @apply border border-black border-opacity-10 bg-white py-1 px-2 rounded hover:border-blue-400 flex items-center;
}
</style>
