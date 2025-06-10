import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../Services/users.service'; // Ajustado para usar UsersService


@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-user-modal.component.html',
  styleUrl: './update-user-modal.component.css'
})
export class UpdateUserModalComponent implements OnInit {
  @Input() userId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<any>();
  form: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService // Cambia AuthService por UsersService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.userId) {
      this.isLoading = true;
      this.usersService.getUserById(this.userId).subscribe({
        next: (user) => {
          if (user) {
            // Rellenar el formulario
            this.form.patchValue({
              email: user.email,
              username: user.username,
              role: user.role
            });
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al cargar el usuario';
          this.isLoading = false;
        }
      });
    }
  }

  submit() {
  if (this.form.invalid || !this.userId) {
    this.errorMessage = 'Formulario inválido o usuario no especificado.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = null;

  const input = {
    username: this.form.value.username,
    email: this.form.value.email,
    role: this.form.value.role
  };

  this.usersService.updateUser(this.userId, input).subscribe({
    next: (updatedUser) => {
      this.isLoading = false;
      this.updateSuccess.emit(updatedUser); // Emitir el usuario actualizado al padre
      this.close.emit(); // Cerrar modal
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.message || 'Error al actualizar el usuario';
    }
  });
}

}
