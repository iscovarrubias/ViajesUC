import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { async } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-updatePassword',
  templateUrl: './updatePassword.page.html',
  styleUrls: ['./updatePassword.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class UpdatePasswordPage implements OnInit {
  newPassword: string = '';
  confirmNewPassword: string = '';
  apiURL = 'http://localhost:3000/users';
  email = localStorage.getItem('email')? localStorage.getItem('email') : '';

  constructor(private alert: ToastController, private http: HttpClient, private router: Router) { }

  onSubmit() {
    if (this.newPassword === this.confirmNewPassword) {
      this.http.get<any>(`${this.apiURL}?username=${this.email}`).subscribe(users => {
        if (users && users.length) {
          const user = users[0];

          user.password = this.newPassword; 

          console.log(user.userId)
          this.http.put(`${this.apiURL}/${user.id}`, user).subscribe(
            response => {
              this.alert.create({
                message: '¡Contraseña cambiada!',
                duration: 2000,
                position: 'top',
              }).then(alert => alert.present());
              this.newPassword = '';
              this.confirmNewPassword = '';
              localStorage.removeItem('email');
            },
            error => {
              this.alert.create({
                message: 'Ocurrió un error al intentar cambiar la contraseña.',
                duration: 2000,
                position: 'top',
              }).then(alert => alert.present());
              console.error(error);
            }
          );
        } else {
          this.alert.create({
            message: '¡No existe un usuario con ese correo!',
            duration: 2000,
            position: 'top',
          }).then(alert => alert.present());
        }
      });
    } else {
      this.alert.create({
        message: 'Las contraseñas no coinciden.',
        duration: 2000,
        position: 'top',
      }).then(alert => alert.present());
    }
  }  

  ngOnInit() {
  }

}
