<script setup lang="ts">
const { formRef, submitForm } = useForm();

const form = ref({
  email: '',
  password: '',
});

const rules = ref(signinRules);

const {
  data: isLogin,
  execute: login,
  status,
} = useAsyncData('signin', async () => useAuthStore().signin(form.value), {
  immediate: false,
});

const handleSubmit = submitForm(async () => {
  await login();
  if (isLogin.value) navigateTo('/trello', { replace: true });
});

definePageMeta({
  layout: 'empty',
});
</script>

<template>
  <div class="py-10">
    <SignForm>
      <template #title>登入</template>

      <template #header>
        <p class="mt-2 text-gray-400">登入您的帳號</p>
        <div class="mt-2">
          <el-divider />
          <p class="text-sm text-gray-400">
            此網站為個人作品Demo，站內的所有資料皆為測試資料，請勿使用真實資料註冊且資料不定時會刪除更新。
          </p>
        </div>
        <el-divider />
      </template>

      <el-form
        ref="formRef"
        label-position="top"
        :model="form"
        :rules="rules"
        @submit.prevent="handleSubmit(formRef)"
      >
        <button class="hidden" type="submit" />
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
        <el-form-item class="mt-10">
          <el-button
            class="w-full"
            type="primary"
            size="large"
            :loading="status === 'pending'"
            @click="handleSubmit(formRef)"
          >
            登入
          </el-button>
        </el-form-item>

        <p class="text-center text-gray-400">
          尚未有帳號？
          <NuxtLink class="underline text-blue-400" to="/signup">
            前往註冊
          </NuxtLink>
        </p>
      </el-form>
    </SignForm>
  </div>
</template>
