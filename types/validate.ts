export type ValidatorFn = (
  rule: any, // element驗證不使用此參數，不定義此參數無妨
  value: string,
  callback: (error?: Error) => void
) => void;
