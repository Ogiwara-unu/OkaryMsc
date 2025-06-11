import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ADD_USER_MUTATION } from '../../grahpql/mutations';
import { Router } from '@angular/router';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css'
})
export class AddUserModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<any>();
  @Output() addSuccess = new EventEmitter<any>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['user', [Validators.required, Validators.pattern(/^(user|admin)$/)]]
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

      const { username, email, password, role } = this.form.value;

      console.log('User'+username+'---'+email+'---'+password+'---'+role)

      this.usersService.createUser({ username, email, password, role }).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.successMessage = '¡Usuario agregado exitosamente!';
          this.userAdded.emit(user); // ✅ emite el evento que el padre escucha
          this.addSuccess.emit(user); // opcional, si lo usas en otro lado
          this.close.emit();
          setTimeout(() => {
          this.close.emit();
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

  
}