import type { Database } from '~/database/types';
import type { Signup } from '~/types/auth';
import type { TablesName } from '~/types/supabase';
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

// 判別是否是合法的資料表名稱
export const isValidTable = (table: string): table is TablesName => {
  return Object.keys(({} as Database).public.Tables).includes(table);
};
