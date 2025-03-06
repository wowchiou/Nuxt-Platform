<script setup lang="ts">
defineProps<{
  code: string;
  customCode: number;
  statusCode: number;
  message: string;
  hint: string | null;
  details: string;
}>();
</script>

<template>
  <div class="leading-1">
    <div class="text-6xl font-bold">
      <Icon class="text-red-800" name="material-symbols:brightness-alert" />
      <h1 class="ml-2 leading-1">
        {{ customCode || code }}
        <p v-if="statusCode">Status Code: {{ statusCode }}</p>
      </h1>
    </div>
    <p class="text-3xl mt-2">{{ message }}</p>
    <p v-if="hint" class="text-3xl mt-2">{{ hint }}</p>
    <p v-if="details" class="text-3xl mt-2">{{ details }}</p>
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
