import { Component } from '@angular/core';
import { DbService } from './services/db.service'; 
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router'; 
import { QRCodeModule } from 'angularx-qrcode'; 
import QRCode from 'qrcode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';  

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, QRCodeModule] 
})
export class AppComponent {
  loginCredentials = { username: '', password: '' }; 
  usuarioLogueado: any = null; 
  loginError: string = ''; 

  qrData: string = 'https://www.duoc.cl/'; 

  constructor(private dbService: DbService, private router: Router, private platform: Platform) {}

  // Método de login
  onLogin() {
    this.dbService.login(this.loginCredentials).subscribe(
      (usuario) => {
        if (usuario) {
          this.usuarioLogueado = usuario;
          console.log('Inicio de sesión exitoso:', usuario);
          this.initializeApp(); 
        } else {
          this.loginError = 'Credenciales incorrectas';
        }
      },
      (error) => {
        this.loginError = error;
        console.error('Error:', error);
      }
    );
  }

  initializeApp() {
    this.router.navigate(['/generar-qr']);  
  }
}
