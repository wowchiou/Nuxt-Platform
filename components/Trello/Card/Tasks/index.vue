<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import type { SortableEvent } from 'vue-draggable-plus';
import type { DragTaskAddData, SetLoadingFunc } from '~/types/trello';

const props = defineProps<{
  listID: string;
}>();

const setTrelloLoading = inject<SetLoadingFunc>('$trelloLoading', () => {});

const trelloStore = useTrelloStore();
const { trelloLists } = storeToRefs(trelloStore);

const newTaskIDX = ref<number | null>(null);
const oldTaskIDX = ref<number | null>(null);
const addInfo = ref<DragTaskAddData | null>(null);

const tasks = computed(
  () => trelloLists.value.find((list) => list.id === props.listID)?.trello_tasks
);

const { status: updateOrderStatus, execute: updateOrder } = useAsyncData(
  'set-trello-tasks-order',
  async () => {
    if (newTaskIDX.value === null || oldTaskIDX.value === null) return;
    await trelloStore.updateTrelloTasksOrder({
      listID: props.listID,
      newIndex: newTaskIDX.value,
      oldIndex: oldTaskIDX.value,
    });
  },
  { immediate: false }
);

const { status: overCrossStatus, execute: overCross } = useAsyncData(
  'set-trello-tasks-over-cross',
  () => trelloStore.updateTrelloTasksOverCross(addInfo.value!),
  { immediate: false }
);

const isFetching = computed(
  () =>
    updateOrderStatus.value === 'pending' || overCrossStatus.value === 'pending'
);

const onUpdate = async (e: SortableEvent) => {
  const { newIndex, oldIndex } = e;
  newTaskIDX.value = newIndex as number;
  oldTaskIDX.value = oldIndex as number;
  await updateOrder();
};

const onAdd = async (e: SortableEvent) => {
  addInfo.value = {
    toID: e.to.parentElement!.dataset.id,
    toIndex: e.newIndex,
    fromID: e.from.parentElement!.dataset.id,
    fromIndex: e.oldIndex,
  } as DragTaskAddData;
  await overCross();
};

watch(isFetching, (val) => {
  setTrelloLoading(val);
});
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
    :disabled="isFetching"
    @add="onAdd"
    @update="onUpdate"
  >
    <div class="task-card" v-for="task in tasks" :key="`task-${task.id}`">
      <p
        class="break-all flex-1 handle"
        :class="{ 'cursor-move': !isFetching }"
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
