<script setup lang="ts">
const errorStore = useErrorStore();
const { activeError: error } = storeToRefs(errorStore);

const message = ref('');
const customCode = ref(0);
const code = ref('');
const details = ref('');
const hint = ref('');
const statusCode = ref(0);

// 如果錯誤訊息不是supabase的錯誤訊息，則顯示錯誤訊息
if (error.value && !('code' in error.value)) {
  message.value = error.value.message;
  customCode.value = error.value.customCode ?? 0;
}

// 如果錯誤訊息是supabase的錯誤訊息，則顯示錯誤訊息
if (error.value && 'code' in error.value) {
  message.value = error.value.message;
  code.value = error.value.code;
  details.value = error.value.details;
  hint.value = error.value.hint;
  statusCode.value = error.value.statusCode ?? 0;
}

// 如果是dev模式，顯示dev錯誤版本，否則顯示prod錯誤版本
// 使dev模式下可看到更多錯誤訊息
const ErrorTemplate =
  process.env.NODE_ENV === 'development'
    ? defineAsyncComponent(() => import('./Dev.vue'))
    : defineAsyncComponent(() => import('./Prod.vue'));

useRouter().afterEach(() => {
  errorStore.clearError();
});
</script>

<template>
  <section class="text-center pt-20">
    <ErrorTemplate :customCode :statusCode :details :message :code :hint />
  </section>
</template>

<style scoped></style>
