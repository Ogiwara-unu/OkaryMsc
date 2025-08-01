// home.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';// Asegúrate de que esta ruta sea correcta
import { LoginModalComponent } from '../../Components/login-modal/login-modal.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { SignupModalComponent } from '../../Components/signup-modal/signup-modal.component';
import { FooterComponent } from '../../Components/footer/footer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, LoginModalComponent, NgIf, SignupModalComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showLoginModal = false;
  showSignupModal = false;

  constructor(public authService: AuthService) {} // Inyecta el AuthService
  onSwitchToLogin() {
    this.showSignupModal = false;

    // Esperamos un poco a que el modal cierre visualmente antes de abrir el otro
    setTimeout(() => {
      this.showLoginModal = true;
    }, 300);
  }
}