import type { FormInstance } from 'element-plus';

export const useForm = () => {
  const formRef = ref<FormInstance>();

  const submitForm = (submitSuccess: () => void) => {
    return (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (!valid) return;
        submitSuccess();
      });
    };
  };

  return { formRef, submitForm };
};
