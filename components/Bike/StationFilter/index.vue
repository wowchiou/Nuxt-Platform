<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();

const emits = defineEmits<{
  (event: 'search'): void;
}>();

const { keyword } = storeToRefs(useBikeStore());

const onSearch = () => {
  emits('search');
};
</script>

<template>
  <div class="flex items-center gap-x-2">
    <el-form class="flex w-full" @submit.prevent="onSearch">
      <el-form-item class="flex-1 !mb-0">
        <el-input v-model="keyword" placeholder="請輸入關鍵字" />
      </el-form-item>

      <el-form-item class="!mb-0 ml-2">
        <el-button type="primary" :loading="loading" @click="onSearch">
          查詢
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
