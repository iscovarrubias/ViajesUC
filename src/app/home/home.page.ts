import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import * as L from 'leaflet';
import db from 'src/assets/db.json';
import { QRCodeModule } from 'angularx-qrcode';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export interface Usuario {
  id: number;
  username: string;
  password: string;
  tipo_usuario: string;
  vehiculo?: string;
  placa_vehiculo?: string;
  sede_asociada?: string;
  ubicacion_actual: { latitud: number; longitud: number };
  sede_destino?: string[];
}

export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  ubicacion: { latitud: number; longitud: number };
}

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  conductor: string;
  hora: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatTabsModule, QRCodeModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  detallePerfil: Usuario | null = null;
  selectedDesde: string = '';  
  selectedHasta: string = '';  
  sedes: Sede[] = [];
  map: L.Map | null = null;
  driverStatus: string = '';
  qrData: string = 'https://www.duoc.cl'; 
  isQrModalOpen: boolean = false;

  viajes: Viaje[] = [
    { id: 1, origen: 'Sede Viña', destino: 'Sede Valparaíso', conductor: 'Juan Pérez', hora: '12:30 PM' },
    { id: 2, origen: 'Sede Viña', destino: 'Sede Valparaíso', conductor: 'Pedro Sánchez', hora: '2:00 PM' },
    { id: 3, origen: 'Plaza Vergara', destino: 'Sede Viña', conductor: 'Ana López', hora: '4:15 PM' }
  ];

  selectedViaje: Viaje | null = null;
  isConductor: boolean = false;  

  constructor(
    private authService: AuthService,  
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private router: Router 
  ) {}

  async ngOnInit() {
    await this.showLoading();  

    try {
      const currentUserId = await this.authService.getCurrentUserId();  

      if (currentUserId !== null) {
        this.detallePerfil = db.usuario.find((user: Usuario) => user.id === Number(currentUserId)) || null;
        
        if (this.detallePerfil?.tipo_usuario.toLowerCase() === 'chofer') {
          this.isConductor = true;
        }

        this.sedes = db.sede;
        this.loadMap();  
      } else {
        console.error('No se encontró el usuario logueado');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.hideLoading(); 
    }
  }

  async onLogout() {
    const toast = await this.toastCtrl.create({
      message: 'Sesión cerrada correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();

    window.location.href = '/login'; 
  }

  async showLoading(message: string = 'Cargando...') {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
  }

  async hideLoading() {
    await this.loadingCtrl.dismiss();
  }

  openMenu() {
    this.menuCtrl.open('first');
  }

  loadMap() {
    const mapElement = document.getElementById('map');
    if (mapElement && !this.map) {
      this.map = L.map(mapElement).setView([-33.02268, -71.55158], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker([-33.02268, -71.55158]).addTo(this.map).bindPopup('Viña del Mar, Quinta Región').openPopup();
    }
  }

  async confirmarViaje() {
    this.driverStatus = ' Llega en 5 minutos';
    const toast = await this.toastCtrl.create({
      message: 'Viaje confirmado',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();

    setTimeout(() => {
      this.driverStatus = 'Llegó';
    }, 5000);

    setTimeout(() => {
      this.driverStatus = 'Se ha cancelado el viaje ';
    }, 10000);
  }

  navigateToQR() {
    this.router.navigate(['/qr']);  
  }
}
