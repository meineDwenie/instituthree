export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: 'Student' | 'Professor' | 'Admin' | 'Tutor' | 'Delegado';
  status: 'Active' | 'Pending';
  photoUrl: string;
}
