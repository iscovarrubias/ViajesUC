import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { PerfilService } from './../services/perfil.service';
import { Preferences } from '@capacitor/preferences';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-generar-qr',
  templateUrl: './generar-qr.page.html',
  styleUrls: ['./generar-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule]
})
export class GenerarQRPage implements OnInit {
  qrCodeValue: string | null = null;

  constructor(
    private router: Router, 
    private perfilService: PerfilService, 
    private menuCtrl: MenuController
  ) { }

  ngOnInit() { }

  async generateQRCode() {
    const newUUID = uuidv4();
    this.qrCodeValue = newUUID;

    console.log('UUID generado:', this.qrCodeValue);
    const currentUserId = (await Preferences.get({ key: 'currentUserId' })).value;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    this.menuCtrl.open('first');
  }
}
