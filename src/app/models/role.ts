export interface Role {
  id: number;
  name: string;
  description: string;
  photoUrl?: string;
  permissions?: string[];
}
