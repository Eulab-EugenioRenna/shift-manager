
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'leader' | 'volounteer';
  contact?: string;
}

