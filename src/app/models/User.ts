
export interface User {
  id?: string;
  email: string;
  password: string;
  passwordConfirm: string;
  first_name: string;
  last_name: string;
  name: string;
  role: 'admin' | 'leader' | 'volontario';
  contact?: string;
}

