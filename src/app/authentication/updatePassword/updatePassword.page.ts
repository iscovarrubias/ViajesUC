import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { IonicModule, ToastController} from '@ionic/angular';
import { RouterModule, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-updatePassword',
  templateUrl: './updatePassword.page.html',
  styleUrls: ['./updatePassword.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class UpdatePasswordPage implements OnInit {
  updatePasswordForm: FormGroup = new FormGroup({});

  constructor(
    private toastController: ToastController,
    private authService: AuthService) { }

  ngOnInit() {
    this.updatePasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onUpdate(){
    if (this.updatePasswordForm.invalid) {
      this.presentToast('Debe ingresar una contraseña válida.');
    }else{
      this.updatePassword();
    }
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

  updatePassword(){
    this.authService.updatePassword(this.updatePasswordForm.value.newPassword).then(() => {
      this.successToast('Contraseña actualizada correctamente.');
    }).catch((error: { message: string; }) => {
      this.presentToast(error.message);
    });
  }

  
  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
