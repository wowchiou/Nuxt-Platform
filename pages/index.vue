<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="flex flex-col items-center justify-start pt-10 relative flex-1">
    <div>
      <p class="text-sm text-gray-400">
        此網站為個人作品Demo，站內的所有資料皆為測試資料，請勿使用真實資料註冊且資料不定時會刪除更新。
      </p>
    </div>
    <InfoDetailForm v-if="authStore.isLogin" class="w-full" />
  </div>
</template>

<style scoped>
.box-title {
  @apply font-bold;
}
.box-text {
  @apply text-slate-400;
}
</style>
