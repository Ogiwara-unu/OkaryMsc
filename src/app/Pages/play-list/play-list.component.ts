import { Component, OnInit } from '@angular/core';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from '../../Components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../Services/auth.service';
import { ShowPlaylistInfoModalComponent } from '../../Components/show-playlist-info-modal/show-playlist-info-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-play-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css']
})
export class PlayListComponent implements OnInit {
  playlists: any[] = [];
  loading = false;
  error: string | null = null;
  isAdmin: boolean = false;

  showUpdateModal = false;
  selectedPlaylist: any = null;
  showAddModal = false;
  showPlaylistInfo = false;

  constructor(private playlistsService: PlaylistsService,private router:Router,
    private authService:AuthService, private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  checkUserRole(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  loadPlaylists() {
    this.loading = true;
    this.error = null;

    this.playlistsService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar playlists';
        this.loading = false;
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

    onDeleteSong(playlistId: string): void {
      console.log(playlistId)
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas eliminar esta Playlist?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.playlistsService.deletePlaylist(playlistId).subscribe({
              next: () => {
                this.loadPlaylists();
                this.showAlert('success', 'Playlist eliminada exitosamente');
              },
              error: (err) => {
                console.error('Error al eliminar la Playlist:', err);
                this.showAlert('error', 'Error al eliminar la Playlist');
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
    this.loadPlaylists(); 
    this.showUpdateModal = false;
  }

  openShowPlaylistInfoModal(): void {
    this.showAddModal = true;
  }

  openAddPlaylistModal(): void {
    this.showAddModal = true;
  }

  onAddSuccess(newPlaylist: any): void {
    this.loadPlaylists(); // Recargar la lista
    this.showAddModal = false;
    this.showAlert('success', 'Playlist agregada exitosamente');
  }

  onRowClick(playlist: any): void {
  this.dialog.open(ShowPlaylistInfoModalComponent, {
    width: '1450px',
    data: { playlistId: playlist.id }
  });
}

}
