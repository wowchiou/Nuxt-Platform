import type { Tables } from '~/database/types';
import type {
  DragTaskAddData,
  TrelloLists,
  TrelloProjects,
  TrelloProjectsAddData,
  TrelloTasksUpdateData,
} from '~/types/trello';

type DragIndex = number | undefined;
type RequiredTrelloTasks = Required<Tables<'trello_tasks'>>;

export const useTrelloStore = defineStore('trello-store', () => {
  const trelloProjects = ref<TrelloProjects[]>([]);
  const activeTrello = ref('');

  const {
    sbSetTrelloProjects,
    sbGetTrelloProjects,
    sbAddTrelloLists,
    sbAddTrelloTasks,
    sbSetTrelloListsOrder,
    sbSetTrelloTasksOrder,
    sbUpdateTrelloTasks,
    sbUpdateTrelloLists,
    sbUpdateTrelloProjects,
    sbDeleteTrelloTasks,
    sbDeleteTrelloLists,
    sbDeleteTrelloProjects,
  } = useSupabase();

  const trelloLists = computed(() => {
    return (
      trelloProjects.value.find((trello) => trello!.id === activeTrello.value)
        ?.trello_lists || []
    );
  });

  function setActiveTrello(id: string) {
    activeTrello.value = id;
  }

  // 新增trello並獲取最新trello projects
  async function addTrello(name: string) {
    const res = await sbSetTrelloProjects(name);
    if (res?.error) return false;
    const addListNames = ['TODO', 'DOING', 'DONE'];
    if (!res?.data) return;
    const addList = addListNames.map((name, idx) => {
      return {
        name,
        order: idx,
        project_id: res.data?.[0].id,
      };
    });
    await addTrelloLists(addList, false);
    await setTrello();
  }

  // 獲取trello projects
  async function setTrello() {
    const res = await sbGetTrelloProjects();
    if (res?.error) return;
    if (!res?.data) return;
    // 針對trello lists和trello tasks進行排序
    res.data.forEach((project) => {
      project.trello_lists = project.trello_lists?.sort(
        (a, b) => a.order! - b.order!
      );
      project.trello_lists?.forEach((list) => {
        list.trello_tasks = list.trello_tasks?.sort(
          (a, b) => a.order! - b.order!
        );
      });
    });
    trelloProjects.value = res?.data || [];
  }

  async function addTrelloLists(
    list: TrelloProjectsAddData[],
    isSetTrello = true
  ) {
    const res = await sbAddTrelloLists(list);
    if (res?.error) return false;
    // 如果需要獲取最新trello projects，則執行setTrello
    if (isSetTrello) await setTrello();
    return true;
  }

  async function addTrelloTasks(name: string, listID: string) {
    const list = trelloLists.value.find((list) => list.id === listID);
    if (!list) return;
    const order = list.trello_tasks?.length ? list.trello_tasks.length : 0;
    const res = await sbAddTrelloTasks({
      name,
      order,
      listID,
    });
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloListsOrder(newIdx: DragIndex, oldIdx: DragIndex) {
    const lists = [...trelloLists.value];
    if (newIdx === undefined || oldIdx === undefined) return;

    const [removed] = lists.splice(oldIdx, 1);
    lists.splice(newIdx, 0, removed);

    const cloneLists = lists.map((itm: TrelloLists, idx: number) => {
      const list = { ...itm };
      delete list.trello_tasks;
      return { ...list, order: idx, project_id: activeTrello.value };
    });
    const res = await sbSetTrelloListsOrder(cloneLists);
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloTasksOrder({
    listID,
    newIndex,
    oldIndex,
  }: {
    listID: string;
    newIndex: DragIndex;
    oldIndex: DragIndex;
  }) {
    const list = [...trelloLists.value].find((list) => list.id === listID);

    if (newIndex === undefined || oldIndex === undefined) return;
    if (!list) return;

    const tasks = list.trello_tasks || [];
    const [removed] = tasks.splice(oldIndex, 1);
    tasks.splice(newIndex, 0, removed);

    const cloneTasks = formatTasksList(listID, tasks as RequiredTrelloTasks[]);

    const res = await sbSetTrelloTasksOrder(cloneTasks);
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloTasksOverCross({
    toID,
    fromID,
    toIndex,
    fromIndex,
  }: DragTaskAddData) {
    const toList = [...trelloLists.value].find((list) => list.id === toID);
    const fromList = [...trelloLists.value].find((list) => list.id === fromID);

    if (!toList || !fromList) return;

    const toTasks = toList.trello_tasks || [];
    const fromTasks = fromList.trello_tasks || [];

    const [removed] = fromTasks.splice(fromIndex, 1);
    toTasks.splice(toIndex, 0, removed);

    const cloneToTasks = formatTasksList(
      toID,
      toTasks as RequiredTrelloTasks[]
    );
    const cloneFromTasks = formatTasksList(
      fromID,
      fromTasks as RequiredTrelloTasks[]
    );

    const res = await sbSetTrelloTasksOrder([
      ...cloneToTasks,
      ...cloneFromTasks,
    ]);
    if (res?.error) return false;
    await setTrello();
  }

  function formatTasksList(
    listID: string,
    tasksList: Tables<'trello_tasks'>[]
  ) {
    return tasksList.map((task, idx) => {
      return { ...task, order: idx, list_id: listID };
    });
  }

  async function deleteTrelloTasks(id: string) {
    const res = await sbDeleteTrelloTasks(id);
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloTasks(
    id: string,
    taskData: TrelloTasksUpdateData
  ) {
    const res = await sbUpdateTrelloTasks(id, taskData);
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloLists(id: string, listData: { name: string }) {
    const res = await sbUpdateTrelloLists(id, listData);
    if (res?.error) return false;
    await setTrello();
  }

  async function deleteTrelloLists(id: string) {
    const res = await sbDeleteTrelloLists(id);
    if (res?.error) return false;
    await setTrello();
  }

  async function updateTrelloProjects(id: string, listData: { name: string }) {
    const res = await sbUpdateTrelloProjects(id, listData);
    if (res?.error) return false;
    await setTrello();
  }

  async function deleteTrelloProjects(id: string) {
    const res = await sbDeleteTrelloProjects(id);
    if (res?.error) return false;
    await setTrello();
  }

  return {
    trelloProjects,
    activeTrello,
    trelloLists,
    setActiveTrello,
    addTrello,
    setTrello,
    addTrelloLists,
    addTrelloTasks,
    updateTrelloListsOrder,
    updateTrelloTasksOrder,
    updateTrelloTasksOverCross,
    deleteTrelloTasks,
    updateTrelloTasks,
    updateTrelloLists,
    deleteTrelloLists,
    updateTrelloProjects,
    deleteTrelloProjects,
  };
});
