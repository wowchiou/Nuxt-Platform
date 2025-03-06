<script setup lang="ts">
import type { FormRules } from 'element-plus';
import type { Tables } from '~/database/types';

const props = defineProps<{
  list: Partial<Tables<'trello_lists'>>;
}>();

const dialogVisible = defineModel<boolean>();
const trelloStore = useTrelloStore();
const { formRef, submitForm } = useForm();

const form = ref({ name: props.list.name! });
const rules = ref<FormRules>({
  name: [
    { required: true, message: '請輸入列表名稱', trigger: 'blur' },
    { validator: validateEmptyString, trigger: 'blur' },
  ],
});

const { status, execute } = useAsyncData(
  'updateTrelloTasks',
  () =>
    trelloStore.updateTrelloLists(props.list.id!, { name: form.value.name }),
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
    title="編輯列表"
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
        <el-input v-model="form.name" placeholder="請輸入列表名稱" />
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
