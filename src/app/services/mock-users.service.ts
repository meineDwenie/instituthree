import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserData } from '../models/userdata';

/**
 * This service provides mock user data for development and testing.
 * It simulates API responses with Observable patterns to match the real service.
 */
@Injectable({
  providedIn: 'root',
})
export class MockUsersService {
  // Mock users data
  private mockUsers: UserData[] = [
    {
      id: '1001',
      name: 'John',
      lastName: 'Doe',
      username: 'john.doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '1002',
      name: 'Jane',
      lastName: 'Smith',
      username: 'jane.smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '1003',
      name: 'Robert',
      lastName: 'Johnson',
      username: 'robert.johnson',
      email: 'robert.johnson@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=8',
    },
    {
      id: '1004',
      name: 'Emily',
      lastName: 'Davis',
      username: 'emily.davis',
      email: 'emily.davis@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=9',
    },
    {
      id: '1005',
      name: 'Michael',
      lastName: 'Wilson',
      username: 'michael.wilson',
      email: 'michael.wilson@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=11',
    },
    {
      id: '1006',
      name: 'Sarah',
      lastName: 'Taylor',
      username: 'sarah.taylor',
      email: 'sarah.taylor@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=10',
    },
    {
      id: '1007',
      name: 'David',
      lastName: 'Brown',
      username: 'david.brown',
      email: 'david.brown@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '1008',
      name: 'Jennifer',
      lastName: 'Garcia',
      username: 'jennifer.garcia',
      email: 'jennifer.garcia@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=25',
    },
    {
      id: '1009',
      name: 'Thomas',
      lastName: 'Martinez',
      username: 'thomas.martinez',
      email: 'thomas.martinez@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=15',
    },
    {
      id: '1010',
      name: 'Lisa',
      lastName: 'Robinson',
      username: 'lisa.robinson',
      email: 'lisa.robinson@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=23',
    },
    {
      id: '1011',
      name: 'Carlos',
      lastName: 'Mendoza',
      username: 'carlos.mendoza',
      email: 'carlos.mendoza@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=30',
    },
    {
      id: '1012',
      name: 'Elena',
      lastName: 'Rodriguez',
      username: 'elena.rodriguez',
      email: 'elena.rodriguez@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=31',
    },
    {
      id: '1013',
      name: 'Nathan',
      lastName: 'Black',
      username: 'nathan.black',
      email: 'nathan.black@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=32',
    },
    {
      id: '1014',
      name: 'Olivia',
      lastName: 'White',
      username: 'olivia.white',
      email: 'olivia.white@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=33',
    },
    {
      id: '1015',
      name: 'Ahmed',
      lastName: 'Hassan',
      username: 'ahmed.hassan',
      email: 'ahmed.hassan@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=34',
    },
    {
      id: '1016',
      name: 'Maria',
      lastName: 'Sanchez',
      username: 'maria.sanchez',
      email: 'maria.sanchez@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=35',
    },
    {
      id: '1017',
      name: 'James',
      lastName: 'Wilson',
      username: 'james.wilson',
      email: 'james.wilson@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=36',
    },
    {
      id: '1018',
      name: 'Zoe',
      lastName: 'Thompson',
      username: 'zoe.thompson',
      email: 'zoe.thompson@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=37',
    },
    {
      id: '1019',
      name: 'Daniel',
      lastName: 'Lee',
      username: 'daniel.lee',
      email: 'daniel.lee@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=38',
    },
    {
      id: '1020',
      name: 'Sophia',
      lastName: 'Chen',
      username: 'sophia.chen',
      email: 'sophia.chen@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=39',
    },
    {
      id: '1021',
      name: 'Isaac',
      lastName: 'Patel',
      username: 'isaac.patel',
      email: 'isaac.patel@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=40',
    },
    {
      id: '1022',
      name: 'Grace',
      lastName: 'Kim',
      username: 'grace.kim',
      email: 'grace.kim@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=41',
    },
    {
      id: '1023',
      name: 'Miguel',
      lastName: 'Gonzalez',
      username: 'miguel.gonzalez',
      email: 'miguel.gonzalez@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=42',
    },
    {
      id: '1024',
      name: 'Emma',
      lastName: 'Watson',
      username: 'emma.watson',
      email: 'emma.watson@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=43',
    },
    {
      id: '1025',
      name: 'Victor',
      lastName: 'Nguyen',
      username: 'victor.nguyen',
      email: 'victor.nguyen@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=44',
    },
    {
      id: '1026',
      name: 'Sofia',
      lastName: 'Perez',
      username: 'sofia.perez',
      email: 'sofia.perez@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=45',
    },
    {
      id: '1027',
      name: 'Benjamin',
      lastName: 'Scott',
      username: 'benjamin.scott',
      email: 'benjamin.scott@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=46',
    },
    {
      id: '1028',
      name: 'Isabella',
      lastName: 'Torres',
      username: 'isabella.torres',
      email: 'isabella.torres@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=47',
    },
    {
      id: '1029',
      name: 'William',
      lastName: 'Sharma',
      username: 'william.sharma',
      email: 'william.sharma@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=48',
    },
    {
      id: '1030',
      name: 'Amelia',
      lastName: 'Jackson',
      username: 'amelia.jackson',
      email: 'amelia.jackson@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=49',
    },
    {
      id: '1031',
      name: 'Lucas',
      lastName: 'Morales',
      username: 'lucas.morales',
      email: 'lucas.morales@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=50',
    },
    {
      id: '1032',
      name: 'Ava',
      lastName: 'Campbell',
      username: 'ava.campbell',
      email: 'ava.campbell@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Pending',
      photoUrl: 'https://i.pravatar.cc/150?img=51',
    },
    {
      id: '1033',
      name: 'Noah',
      lastName: 'Edwards',
      username: 'noah.edwards',
      email: 'noah.edwards@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=52',
    },
    {
      id: '1034',
      name: 'Charlotte',
      lastName: 'Greene',
      username: 'charlotte.greene',
      email: 'charlotte.greene@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=53',
    },
    {
      id: '1035',
      name: 'Liam',
      lastName: 'Connor',
      username: 'liam.oconnor',
      email: 'liam.oconnor@example.com',
      password: 'password123',
      role: 'Usuario',
      status: 'Active',
      photoUrl: 'https://i.pravatar.cc/150?img=54',
    },
  ];

  constructor() {}

  /**
   * Get all users
   * @returns Observable of UserData array with simulated network delay
   */
  getUsers(): Observable<UserData[]> {
    // Return a copy of mock data with a simulated network delay
    return of([...this.mockUsers]).pipe(delay(800));
  }

  /**
   * Get a user by ID
   * @param id User ID to find
   * @returns Observable of the found UserData or undefined
   */
  getUserById(id: string): Observable<UserData> {
    const user = this.mockUsers.find((user) => user.id === id);

    if (!user) {
      // Simulate a "not found" scenario
      return of({} as UserData).pipe(delay(500));
    }

    return of({ ...user }).pipe(delay(500));
  }

  /**
   * Create a new user
   * @param user User data to create
   * @returns Observable of the created UserData with new ID
   */
  createUser(user: UserData): Observable<UserData> {
    // Create a new user with a generated ID
    const newUser: UserData = {
      ...user,
      id: this.generateId(),
    };

    this.mockUsers.push(newUser);
    return of({ ...newUser }).pipe(delay(800));
  }

  /**
   * Update an existing user
   * @param user User data to update
   * @returns Observable of the updated UserData
   */
  updateUser(user: UserData): Observable<UserData> {
    const index = this.mockUsers.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      this.mockUsers[index] = { ...user };
      return of({ ...user }).pipe(delay(800));
    }

    // If user not found, return empty object
    return of({} as UserData).pipe(delay(500));
  }

  /**
   * Delete a user by ID
   * @param id User ID to delete
   * @returns Observable of success status
   */
  deleteUser(id: string): Observable<boolean> {
    const index = this.mockUsers.findIndex((user) => user.id === id);

    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(true).pipe(delay(800));
    }

    return of(false).pipe(delay(500));
  }

  /**
   * Generate a simple ID for mock data
   * @returns A new unique ID string
   */
  private generateId(): string {
    // Find the highest current ID and add 1
    const ids = this.mockUsers.map((user) => parseInt(user.id, 10));
    const maxId = Math.max(...ids);
    return (maxId + 1).toString();
  }
}
