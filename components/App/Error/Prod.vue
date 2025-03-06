<script setup lang="ts">
const props = defineProps<{
  code: string;
  customCode: number;
  statusCode: number;
  message: string;
  hint: string | null;
  details: string;
}>();

const errorStore = useErrorStore();

const error = ref({
  code: 500,
  message: '抱歉，發生錯誤！',
});

if (errorStore.isCustomError) {
  error.value.code = props.customCode;
  error.value.message = props.message;
}

// 如果是supabase傳來406錯誤，則顯示404錯誤
if (props.statusCode === 406) {
  error.value.code = 404;
  error.value.message = '抱歉，找不到資料！';
}
</script>

<template>
  <div class="leading-1">
    <div class="text-6xl font-bold">
      <Icon class="text-red-800" name="material-symbols:brightness-alert" />
      <h1 class="ml-2 leading-1">{{ error.code }}</h1>
    </div>
    <p class="text-3xl mt-2">{{ error.message }}</p>

    <div class="mt-5">
      <NuxtLink class="mt-5 block" to="/">
        <el-button class="max-w-36" type="primary" size="large">
          回到首頁
        </el-button>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
