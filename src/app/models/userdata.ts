export interface UserData {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
  role: 'Usuario' | 'Admin';
  status: 'Active' | 'Pending';
  photoUrl: string;
  originalRole?: any; // Optional field to store the original object
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  status: boolean;
}
