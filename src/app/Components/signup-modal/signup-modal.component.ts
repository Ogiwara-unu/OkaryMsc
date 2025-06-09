// signup-modal.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }


  submit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      const { username, email, password } = this.form.value;

      this.authService.register(username, email, password).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.successMessage = '¡Registro exitoso! Por favor inicia sesión.';
          setTimeout(() => {
            this.close.emit();
            this.switchToLogin.emit();
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
          console.error('Error completo:', error);
        }
      });
    }
  }

  private getErrorMessage(err: any): string {
    if (err.message.includes('duplicate') || err.message.includes('ya existe')) {
      return 'El email ya está registrado';
    }
    if (err.message.includes('password')) {
      return 'Error con la contraseña proporcionada';
    }
    if (err.message) {
      return err.message;
    }
    return 'Error desconocido al registrar el usuario';
  }



  onSwitchToLogin() {
    this.close.emit();
    this.switchToLogin.emit();
  }
}