import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/users.service'; 
import { NavbarComponent } from '../navbar/navbar.component';
import { UpdateUserModalComponent } from '../update-user-modal/update-user-modal.component';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { FooterComponent } from '../footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-administration',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    NgIf, 
    UpdateUserModalComponent, 
    AddUserModalComponent,
    MatProgressSpinnerModule,
    FooterComponent
  
  ],
  templateUrl: './user-administration.component.html',
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent implements OnInit {
  users: User[] = [];
  error: string | null = null;
  isLoading = false;

  showUpdateModal = false;
  selectedUserId: string | null = null;  
  showAddUserModal = false;

  constructor(private usersService: UsersService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    console.log('Iniciando carga de usuarios');
    this.isLoading = true;
    this.usersService.getUsers(20).subscribe({
      next: (users) => {
        console.log('Usuarios recibidos:', users);
        this.users = [...users];
        this.cdr.detectChanges(); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  onDeleteUser(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.isLoading = true;
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.isLoading = false;
        }
      });
    }
  }

  onEditUser(id: string) {
    console.log(id);
    this.selectedUserId = id;
    this.showUpdateModal = true;
  }

  onUpdateSuccess(updatedUser: User) {
    this.users = this.users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    this.showUpdateModal = false;
  }

  // Método para abrir el modal de agregar usuario
  openAddUserModal() {
    this.showAddUserModal = true;
  }

  // Método para manejar cuando se agrega un usuario
  onUserAdded(newUser: User) {
    console.log(newUser);
    this.users = [...this.users, newUser]; 
    console.log('zunga')
    this.showAddUserModal = false;
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }
}