import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.presentToast('Debe ingresar un usuario y contraseña válidos.');
    } else {
      await this.login();
    }
  }

  async login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
        next: (data) => {
            console.log('Inicio de sesión exitoso:', data);
            this.router.navigate(['/home']);
        },
        error: (error) => {
            this.presentToast('Error al iniciar sesión: ' + error.message);
        }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }

}
