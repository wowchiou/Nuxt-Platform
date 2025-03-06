<script setup lang="ts">
const trelloStore = useTrelloStore();
const { trelloProjects, activeTrello } = storeToRefs(trelloStore);

watch(activeTrello, async () => {
  await trelloStore.setTrello();
  navigateTo(`/trello/${activeTrello.value}`);
});
</script>

<template>
  <div class="flex gap-x-2">
    <el-select v-model="activeTrello" style="width: 240px">
      <el-option label="選擇專案" value="" disabled>選擇專案</el-option>
      <el-option
        v-for="item in trelloProjects"
        :key="item.id"
        :label="item.name"
        :value="item.id!"
      />
    </el-select>
    <TrelloFilterButtonEdit />
    <TrelloFilterButtonCreate />
  </div>
</template>

<style scoped></style>
