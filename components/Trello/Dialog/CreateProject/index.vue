<script setup lang="ts">
import type { FormRules } from 'element-plus';

const dialogVisible = defineModel<boolean>();
const trelloStore = useTrelloStore();
const { trelloProjects } = storeToRefs(trelloStore);
const { formRef, submitForm } = useForm();

const form = ref({ name: '' });
const rules = ref<FormRules>({
  name: [
    { required: true, message: '請輸入專案名稱', trigger: 'blur' },
    { validator: validateEmptyString, trigger: 'blur' },
  ],
});

const { status, execute } = useAsyncData(
  'addTrello',
  () => trelloStore.addTrello(form.value.name),
  { immediate: false }
);

const handleSubmit = submitForm(async () => {
  await execute();
  if (!trelloProjects.value.length) return;
  const id = trelloProjects.value.find(
    (itm) => itm.name === form.value.name
  )?.id;
  if (!id) return;
  trelloStore.setActiveTrello(id);
  navigateTo(`/trello/${id}`);
  handleClose();
});

const handleClose = () => {
  dialogVisible.value = false;
  form.value.name = '';
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="創建任務專案"
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
            創建
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped></style>
