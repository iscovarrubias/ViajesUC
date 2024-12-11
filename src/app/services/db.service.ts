import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl = 'http://localhost:3000';  

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/usuario/login`, credentials).pipe(
      map((usuarios) =>
        usuarios.find(
          (usuario) =>
            usuario.username === credentials.username &&
            usuario.password === credentials.password
        )
      ),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError('Usuario o contraseña incorrectos');
      })
    );
  }

  getUsuarios(): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/usuario/getUsuarios`, {}).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError('No se pudieron obtener los usuarios');
      })
    );
  }
}
