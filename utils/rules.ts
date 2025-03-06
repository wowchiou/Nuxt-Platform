import type { FormRules } from 'element-plus';
import type { Signin, Signup } from '~/types/auth';

export const signinRules: FormRules<Signin> = {
  email: [
    { required: true, message: '請輸入電子郵箱', trigger: 'blur' },
    {
      type: 'email',
      message: '請輸入正確的電子郵箱',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼至少 6 位字元', trigger: 'blur' },
  ],
};

export const createSignupRules = (form: Ref<Signup>): FormRules<Signup> => {
  return {
    ...signinRules,
    username: [
      { required: true, message: '請輸入用戶名', trigger: 'blur' },
      { validator: validateEmptyString, trigger: 'blur' },
      { min: 3, message: '用戶名至少 3 位字元', trigger: 'blur' },
    ],
    confirmPassword: [
      { required: true, message: '請再次輸入密碼', trigger: 'blur' },
      {
        validator: createValidateConfirmPSW(form),
        trigger: 'blur',
      },
    ],
  };
};
