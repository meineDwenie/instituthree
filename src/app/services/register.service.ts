import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private baseUrl = 'https://registerapp.up.railway.app/api';
  constructor(private http: HttpClient) {}

  registerUser(requestBody: any): Observable<any> {
    return this.http.post<Register[]>(this.baseUrl + '/register', requestBody);
  }
}
