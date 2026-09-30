export interface Workstation {
  id: number;
  code: string;
  name: string;
  capacity: number;
  open_from: string;
  open_until: string;
  active: boolean;
}
