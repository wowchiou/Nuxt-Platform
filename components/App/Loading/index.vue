<script setup lang="ts">
withDefaults(
  defineProps<{
    showLoader?: boolean;
  }>(),
  {
    showLoader: true,
  }
);
</script>

<template>
  <div
    class="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-slate-200 bg-opacity-70 !z-[999]"
  >
    <Icon
      v-if="showLoader"
      class="text-4xl"
      name="line-md:loading-twotone-loop"
    />
  </div>
</template>
