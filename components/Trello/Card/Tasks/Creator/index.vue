<script setup lang="ts">
import type { FormRules } from 'element-plus';

const props = defineProps<{
  listID: string;
}>();

const trelloStore = useTrelloStore();
const { formRef, submitForm } = useForm();
const { clickRef, isActive } = useClick();

const inputRef = ref();
const form = ref({ name: '' });
const rules = ref<FormRules>({
  name: [
    { required: true, message: '請輸入新任務', trigger: 'blur' },
    { validator: validateEmptyString, trigger: 'blur' },
  ],
});

const { status, execute } = useAsyncData(
  'addTrelloTasks',
  () => trelloStore.addTrelloTasks(form.value.name, props.listID),
  { immediate: false }
);

const handleClick = () => {
  isActive.value = true;
  nextTick(() => inputRef.value.focus());
};

const handleSubmit = submitForm(async () => {
  await execute();
  form.value.name = '';
  isActive.value = false;
});

watch(isActive, (val) => {
  if (!val) return;
  form.value.name = '';
});
</script>

<template>
  <div ref="clickRef">
    <div v-if="isActive">
      <el-form
        ref="formRef"
        :model="form"
        :rules
        @submit.prevent="handleSubmit(formRef)"
      >
        <el-form-item prop="name">
          <el-input
            ref="inputRef"
            v-model="form.name"
            placeholder="請輸入新任務"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="w-full"
            type="primary"
            :loading="status === 'pending'"
            @click="handleSubmit(formRef)"
          >
            <Icon class="app-icon" name="material-symbols:add" />
            <span>添加任務</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button v-else class="w-full" @click.stop="handleClick">
      <Icon class="app-icon" name="material-symbols:add" />
      <span>添加任務</span>
    </el-button>
  </div>
</template>

<style scoped></style>
