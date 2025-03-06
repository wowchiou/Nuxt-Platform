<script setup lang="ts">
import type { FormRules } from 'element-plus';

const { clickRef, isActive } = useClick();
const { formRef, submitForm } = useForm();
const trelloStore = useTrelloStore();
const { trelloLists, activeTrello } = storeToRefs(trelloStore);

const inputRef = ref();
const form = ref({ name: '' });
const rules = ref<FormRules>({
  name: [
    { required: true, message: '請輸入列表名稱', trigger: 'blur' },
    { validator: validateEmptyString, trigger: 'blur' },
  ],
});

const order = computed(() => {
  return trelloLists.value.length ? trelloLists.value.length : 0;
});

const { status, execute } = useAsyncData(
  'addTrelloLists',
  () =>
    trelloStore.addTrelloLists([
      {
        name: form.value.name,
        order: order.value,
        project_id: activeTrello.value,
      },
    ]),
  {
    immediate: false,
  }
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
  if (!val) form.value.name = '';
});
</script>

<template>
  <div ref="clickRef">
    <TrelloCard :class="{ create: !isActive }" @click.stop="handleClick">
      <div
        v-if="!isActive"
        class="flex items-center text-[14px] cursor-pointer"
      >
        <Icon class="app-icon" name="material-symbols:add" />
        <span>添加列表</span>
      </div>

      <template v-else>
        <el-form
          class="w-full"
          ref="formRef"
          :model="form"
          :rules
          label-position="top"
          @submit.prevent="handleSubmit(formRef)"
        >
          <el-form-item prop="name">
            <el-input
              ref="inputRef"
              v-model="form.name"
              placeholder="請輸入列表名稱"
            />
          </el-form-item>
          <el-form-item class="!mb-0">
            <el-button
              type="primary"
              :loading="status === 'pending'"
              @click="handleSubmit(formRef)"
            >
              <Icon class="app-icon" name="material-symbols:add" />
              添加列表
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </TrelloCard>
  </div>
</template>

<style scoped></style>
