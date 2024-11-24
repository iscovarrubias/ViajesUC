import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Observable, from, of, switchMap, catchError, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'src/environments/environment';

interface User {
    id: number;
    username: string;
    password: string;
    tipo_usuario: string;
    ubicacion_actual: {
        latitud: number;
        longitud: number;
    };
    sede_destino?: string[];  
    vehiculo?: string;        
    placa_vehiculo?: string;
    sede_asociada?: string;   
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private router: Router, private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {

        return this.http.get<any>('assets/db.json').pipe(
            switchMap((data) => {
       
                const user: User | undefined = data.usuario.find(
                    (user: User) => user.username === email && user.password === password
                );

                if (user) {
                    
                    return this.storeUserData(user).pipe(
                        switchMap(() => {
                            return of(user); 
                        })
                    );
                } else {
                    
                    throw new Error('Credenciales incorrectas.');
                }
            }),
            catchError((error) => throwError(() => error))
        );
    }

    private storeUserData(user: User): Observable<void> {
        return from(Promise.all([
            Preferences.set({ key: 'currentUserToken', value: 'fake_token' }), 
            Preferences.set({ key: 'currentUserId', value: user.id.toString() }),
            Preferences.set({ key: 'currentUserEmail', value: user.username }),
        ])).pipe(switchMap(() => of(undefined)));
    }

    logout(): Observable<any> {
        return from(Promise.all([
            Preferences.remove({ key: 'currentUserToken' }),
            Preferences.remove({ key: 'currentUserId' }),
            Preferences.remove({ key: 'currentUserEmail' }),
        ])).pipe(
            tap(() => {
                this.router.navigate(['/login']);
            }),
            catchError((error) => throwError(() => error))
        );
    }

    get authState$(): Observable<any> {
        return from(
            Preferences.get({ key: 'currentUserToken' })
        ).pipe(
            switchMap(({ value }) => {
                if (value) {
                    return of(true);
                } else {
                    return of(false);
                }
            })
        );
    }

    async getCurrentUserToken(): Promise<string | null> {
        const { value } = await Preferences.get({ key: 'currentUserToken' });
        return value?.toString() || null;
    }

    async getCurrentUserId(): Promise<string | null> {
        const { value } = await Preferences.get({ key: 'currentUserId' });
        return value?.toString() || null;
    }

    async getCurrentUserEmail(): Promise<string | null> {
        const { value } = await Preferences.get({ key: 'currentUserEmail' });
        return value?.toString() || null;
    }

    async resetPassword(email: string) {

        console.log(`Enviando correo de recuperación a ${email}`);
    }

    async updatePassword(newPassword: string) {

        console.log(`Actualizando la contraseña a ${newPassword}`);
    }
}
