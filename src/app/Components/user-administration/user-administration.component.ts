import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/users.service'; 
import { NavbarComponent } from '../navbar/navbar.component';
import { UpdateUserModalComponent } from '../update-user-modal/update-user-modal.component';
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
  imports: [CommonModule, NavbarComponent, NgIf, UpdateUserModalComponent],
  templateUrl: './user-administration.component.html',
  styleUrl: './user-administration.component.css'
})
export class UserAdministrationComponent implements OnInit {
  users: User[] = [];
  error: string | null = null;
  isLoading = false;

  showUpdateModal = false;
  selectedUserId: string | null = null;  

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.usersService.getUsers(20).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
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

  // Método para abrir el modal de actualización
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

}
