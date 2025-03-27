<script setup lang="ts">
const { formRef, submitForm } = useForm();
const authStore = useAuthStore();
const { user, profile } = storeToRefs(authStore);
const isEditing = ref(false);
const userProfile = computed(() => profile.value);

const form = ref({
  username: profile.value?.username ?? '',
  bio: profile.value?.bio ?? '',
  city: profile.value?.city ?? '',
});

const rules = ref({
  username: [{ required: true, message: '請輸入用戶名', trigger: 'blur' }],
});

const { status, execute } = useAsyncData(
  'update-profile',
  () => authStore.updateProfile(form.value),
  { immediate: false }
);

const saveFrom = submitForm(async () => {
  await execute();
  isEditing.value = false;
});

const setForm = () => {
  form.value.username = profile.value?.username ?? '';
  form.value.bio = profile.value?.bio ?? '';
};

const closeEdit = () => {
  isEditing.value = false;
  setForm();
};

watch(profile, setForm, { immediate: true });
</script>

<template>
  <div class="flex justify-center pt-10 relative flex-1">
    <AppLoading v-if="!user || !profile" />
    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules
      class="max-w-[600px] w-[90%]"
      @submit.prevent
    >
      <div class="bg-white rounded p-5">
        <el-button link @click="isEditing = true">
          <Icon
            class="app-icon text-blue-500"
            name="material-symbols:edit-square-outline"
          />
          <div class="ml-1"><span v-if="isEditing">編輯</span>個人資料</div>
        </el-button>

        <el-descriptions class="mt-5" direction="vertical" :column="1" border>
          <el-descriptions-item label="用戶名">
            <div v-if="!isEditing">{{ userProfile?.username }}</div>

            <el-form-item v-else prop="username">
              <el-input v-model="form.username" placeholder="請輸入用戶名" />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="電子信箱">
            <div v-if="!isEditing">{{ user!.email }}</div>

            <el-form-item v-else>
              <el-input v-model="user!.email" disabled />
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="居住城市">
            <div v-if="!isEditing">{{ userProfile?.city || '暫無資料' }}</div>

            <el-form-item v-else>
              <el-select
                class="flex-1"
                v-model="form.city"
                size="large"
                placeholder="請選擇城市"
              >
                <el-option label="請選擇城市" value="" disabled />
                <el-option
                  v-for="city in CITY_LIST"
                  :key="city.CityCode"
                  :label="city.CityName"
                  :value="city.CityName"
                />
              </el-select>
            </el-form-item>
          </el-descriptions-item>

          <el-descriptions-item label="個人簡介" :span="2">
            <div v-if="!isEditing" class="whitespace-pre-line">
              {{ userProfile?.bio || '暫無簡介，趕快來新增吧！' }}
            </div>

            <el-form-item v-else prop="bio">
              <el-input
                v-model="form.bio"
                type="textarea"
                placeholder="請輸入個人簡介"
              />
            </el-form-item>
          </el-descriptions-item>
        </el-descriptions>

        <el-form-item v-if="isEditing" class="!mb-0 mt-5">
          <div class="w-full flex justify-end items-center">
            <el-button :loading="status === 'pending'" @click="closeEdit"
              >取消</el-button
            >
            <el-button
              :loading="status === 'pending'"
              type="primary"
              @click="saveFrom(formRef)"
              >編輯</el-button
            >
          </div>
        </el-form-item>
      </div>
    </el-form>
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
