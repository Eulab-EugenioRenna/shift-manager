import { User } from "./User";

export interface Service {
  id: string;
  name: string;
  leader: User;
  volunteers: User[];
}
