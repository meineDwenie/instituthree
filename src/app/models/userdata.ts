export interface UserData {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'Student' | 'Professor' | 'Admin' | 'Tutor' | 'Delegado';
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
