<script setup lang="ts">
const authStore = useAuthStore();
const { user, profile } = storeToRefs(authStore);
</script>

<template>
  <div class="flex justify-center pt-10">
    <div class="bg-white rounded max-w-[600px] w-[90%] p-5">
      <div class="flex justify-center">
        <el-avatar
          :size="100"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </div>

      <el-descriptions
        class="mt-5"
        title="個人資料"
        direction="vertical"
        :column="2"
        border
      >
        <el-descriptions-item label="用戶名">
          {{ profile?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="電子信箱">
          {{ user?.email }}
        </el-descriptions-item>
        <el-descriptions-item label="個人簡介" :span="2">
          {{ profile?.bio || '暫無簡介，趕快來新增吧！' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
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
