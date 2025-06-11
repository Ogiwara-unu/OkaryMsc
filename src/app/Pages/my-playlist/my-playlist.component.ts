import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from '../../Components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaylistModalComponent } from '../../Components/add-playlist-modal/add-playlist-modal.component';
import { UpdatePlaylistModalComponent } from '../../Components/update-playlist-modal/update-playlist-modal.component';
import Swal from 'sweetalert2';
import { ShowPlaylistInfoModalComponent } from '../../Components/show-playlist-info-modal/show-playlist-info-modal.component';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-playlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
    UpdatePlaylistModalComponent,
    AddPlaylistModalComponent,
    ShowPlaylistInfoModalComponent
  ],
  templateUrl: './my-playlist.component.html',
  styleUrl: './my-playlist.component.css'
})
export class MyPlaylistComponent {
  playlists:any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin: boolean = false;
  isLoggedIn = false;
  private subscription!: Subscription;

  showUpdateModal = false;
  selectedPlaylist: any = null;
  showAddModal = false;
  showInfoModal = false;
  playlistToShow: any = null;

  constructor(
      private playListService: PlaylistsService,
      private router: Router,
      private authService: AuthService,
      private dialog: MatDialog,
      
    ) { }

  
  ngOnInit() {
  this.subscription = this.authService.currentUser$.subscribe(user => {
    this.isAdmin = user?.role === 'admin';
    this.isLoggedIn = !!user; 
    console.log(this.isAdmin ? 'El usuario logeado es admin' : 'El usuario logeado no es admin');
    this.loadPlaylist();
  });
}

 
  loadPlaylist(): void {
  this.loading = true;
  this.error = null;

  // Obtiene el usuario desde sessionStorage
  const userJson = sessionStorage.getItem('user');
  if (!userJson) {
    this.error = 'No se encontró información de usuario';
    this.loading = false;
    return;
  }

  const user = JSON.parse(userJson);
  const userId = user.id;

  this.playListService.getPlaylistsByUser(userId).subscribe({
    next: (playlists) => {
      this.playlists = playlists;
      console.log('Playlists cargadas:', this.playlists);
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Error al cargar las playlists';
      this.loading = false;
      console.error('Error:', err);
    }
  });
}

  formatDescription(desc: string) {
    return desc?.length > 50 ? desc.substring(0, 50) + '...' : desc;
  }

  showAlert(type: 'success' | 'error', message: any) {
      Swal.fire({
        title: message,
        icon: type,
        timer: 4000,
        showConfirmButton: false
      });
    }

  onDeletePlaylist(playlistId: string): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas eliminar esta playlist?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.playListService.deletePlaylist(playlistId).subscribe({
        next: () => {
          console.log('Playlist eliminada exitosamente');
          this.playlists = this.playlists.filter(p => p.id !== playlistId);
          this.showAlert('success', 'Playlist eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar la playlist:', err);
          this.showAlert('error', 'Error al eliminar la playlist');
        }
      });
    }
  });
}

  onEditPlaylist(playlist: any): void {
  this.selectedPlaylist = playlist;
  this.showUpdateModal = true;
  }

  onUpdateSuccess(updatedPlaylist: any): void {
    this.loadPlaylist();
    this.showUpdateModal = false;
  }

  openAddSongModal(): void {
    this.showAddModal = true;
  }

  onAddSuccess(newPlaylist: any): void {
    this.playlists = [...this.playlists, newPlaylist];
    console.log('Nueva playlist agregada:', newPlaylist); 
    this.showAddModal = false;
    this.showAlert('success', 'Playlist agregada exitosamente');
  }

  openPlayListInfoModal(playlist: any) {
    this.playlistToShow = playlist;
    this.showInfoModal = true;
  }

  closePlayListInfoModal() {
    this.showInfoModal = false;
    this.playlistToShow = null;
  }

  onRowClick(playlist: any): void {
  this.dialog.open(ShowPlaylistInfoModalComponent, {
    width: '1450px',
    data: { playlistId: playlist.id }
  });
}
}
