import { Service } from "./Service";

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description: string;
  categoryId: string;
  services: Service[];
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}
