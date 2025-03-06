<template>
  <div class="trello-card">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.trello-card {
  @apply w-[250px] bg-white rounded p-2 select-none flex-shrink-0 shadow-sm;
}

.trello-card.create {
  @apply bg-slate-600 bg-opacity-60 text-white hover:bg-opacity-100;
}
</style>
