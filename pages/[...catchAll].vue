<script setup lang="ts">
const { setError } = useErrorStore();

onMounted(() => {
  setError({
    error: '頁面不存在',
    customCode: 404,
  });
});
</script>

<template>
  <div></div>
</template>
