import type { Signup } from '~/types/auth';
import type { ValidatorFn } from '~/types/validate';

export const createValidateConfirmPSW = (form: Ref<Signup>): ValidatorFn => {
  return (rule, value, callback) => {
    if (value !== form.value.password) {
      callback(new Error('密碼輸入不一致'));
    } else {
      callback();
    }
  };
};

export const validateEmptyString: ValidatorFn = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('請輸入內容'));
  } else {
    callback();
  }
};
