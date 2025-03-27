<script setup lang="ts">
const { formRef, submitForm } = useForm();

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const rules = ref(createSignupRules(form));

const { data, execute, status } = useAsyncData(
  'register',
  () => useAuthStore().signup(form.value),
  { immediate: false }
);

const handleSubmit = submitForm(async () => {
  await execute();
  if (!data.value) return;
  window.location.href = '/';
});

definePageMeta({
  layout: 'empty',
});
</script>

<template>
  <div class="py-10">
    <SignForm>
      <template #title>註冊</template>

      <template #header>
        <p class="mt-2 text-gray-400">創建一個帳號</p>
        <div class="mt-2">
          <el-divider></el-divider>
        </div>
      </template>

      <el-form
        ref="formRef"
        label-position="top"
        :model="form"
        :rules="rules"
        @submit.prevent="handleSubmit(formRef)"
      >
        <button class="hidden" type="submit" />
        <el-form-item label="使用者名稱" prop="username">
          <el-input
            v-model="form.username"
            size="large"
            placeholder="請輸入使用者名稱"
          />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            size="large"
            placeholder="請輸入電子郵箱"
          />
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            size="large"
            placeholder="請輸入密碼"
          />
        </el-form-item>
        <el-form-item label="確認密碼" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            size="large"
            placeholder="請再次輸入密碼"
          />
        </el-form-item>
        <el-form-item class="mt-10">
          <el-button
            class="w-full"
            type="primary"
            size="large"
            :loading="status === 'pending'"
            @click="handleSubmit(formRef)"
          >
            註冊
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        <p class="text-center text-gray-400">
          已註冊帳號？<NuxtLink class="underline text-blue-400" to="/signin"
            >前往登入</NuxtLink
          >
        </p>
      </div>
    </SignForm>
  </div>
</template>
