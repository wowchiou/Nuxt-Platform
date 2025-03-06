<script setup lang="ts">
import type { FormRules } from 'element-plus';

const dialogVisible = defineModel<boolean>();
const trelloStore = useTrelloStore();
const { trelloProjects, activeTrello } = storeToRefs(trelloStore);

const project = ref(
  trelloProjects.value.find((project) => project.id === activeTrello.value)
);

const { formRef, submitForm } = useForm();
const form = ref({ name: project.value?.name! });
const rules = ref<FormRules>({
  name: [
    { required: true, message: '請輸入專案名稱', trigger: 'blur' },
    { validator: validateEmptyString, trigger: 'blur' },
  ],
});

const { status, execute } = useAsyncData(
  'updateTrelloTasks',
  () =>
    trelloStore.updateTrelloProjects(project.value?.id!, {
      name: form.value.name,
    }),
  { immediate: false }
);

const handleSubmit = submitForm(async () => {
  await execute();
  handleClose();
});

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="編輯專案"
    width="500"
    destroy-on-close
    append-to-body
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules
      @submit.prevent="handleSubmit(formRef)"
    >
      <el-form-item label="名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入專案名稱" />
      </el-form-item>

      <el-form-item>
        <div class="w-full flex justify-end">
          <el-button @click="handleClose"> 取消 </el-button>
          <el-button
            type="primary"
            :loading="status === 'pending'"
            @click="handleSubmit(formRef)"
          >
            送出更新
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
