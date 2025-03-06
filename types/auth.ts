export interface Signin {
  email: string;
  password: string;
}

export interface Signup extends Signin {
  username: string;
  confirmPassword: string;
}

export interface ProfileForm {
  id: string;
  username: string;
  full_name: string;
}
