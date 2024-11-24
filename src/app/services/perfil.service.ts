import { Inject, Injectable, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { delay } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { DbService } from './db.service';  

@Injectable({
  providedIn: 'root',
})
export class PerfilService implements OnDestroy {
  private authSubscription: Subscription;
  private MAX_RETRIES = 3;

  constructor(
    private authService: AuthService,
    private dbService: DbService  
  ) {
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.getUserProfile().then((data) => {
        if (data) {
          console.log('Perfil del usuario cargado:', data);
        }
      }).catch((error) => {
        console.error('Error al cargar el perfil del usuario:', error);
      });
    });
  }

  async getUserProfile(retries = this.MAX_RETRIES): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const id = await this.authService.getCurrentUserId();

        if (!id) {
          console.error('ID de usuario no válido:', id);
          return null;
        }

        const users = await this.dbService.getUsuarios().toPromise();  

        if (!Array.isArray(users)) {
          console.warn('La lista de usuarios no es válida o está vacía');
          return null;
        }

        const user = users.find((user: any) => user.id === id);  

        if (!user) {
          console.warn('No se encontró el perfil del usuario para el ID:', id);
          throw new Error('No se encontró el perfil del usuario');
        }

        return user;  
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (i === retries - 1) {
            console.error('Se alcanzó el número máximo de reintentos. Error inesperado:', err.message);
            return null;
          }
          console.warn('Reintentando obtener el perfil del usuario...', err.message);
        } else {
          console.error('Error desconocido al obtener el perfil del usuario:', err);
        }
        
        await of(null).pipe(delay(1000)).toPromise();  
      }
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
