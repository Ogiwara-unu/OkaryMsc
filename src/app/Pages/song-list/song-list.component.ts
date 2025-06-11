import { Component, OnInit } from '@angular/core';
import { SongService } from '../../Services/songs.service';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { FooterComponent } from '../../Components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UpdateSongModalComponent } from '../../Components/update-song-modal/update-song-modal.component';
import { AddSongModalComponent } from '../../Components/add-song-modal/add-song-modal.component';
import Swal from 'sweetalert2';
import { SongInfoModalComponent } from '../../Components/song-info-modal/song-info-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
    UpdateSongModalComponent,
    AddSongModalComponent,
    SongInfoModalComponent,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs: any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin: boolean = false;
  isLoggedIn = false;
  private subscription!: Subscription;
  //PLAYLIST
  userPlaylists: any[] = [];
  showPlaylistMenu: boolean = false;
  currentSelectedSongId: string | null = null;

  showUpdateModal = false;
  selectedSong: any = null;
  showAddModal = false;
  showInfoModal = false;
  songToShow: any = null;

  constructor(
    private songService: SongService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private playlistsService: PlaylistsService

  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
      this.isLoggedIn = !!user;
      console.log(this.isAdmin ? 'El usuario logeado es admin' : 'El usuario logeado no es admin');
      this.checkUserRole();
      this.loadSongs();

      if (this.isLoggedIn) {
        this.loadUserPlaylists();
      }
    });
  }



  checkUserRole(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  loadSongs(): void {
    this.loading = true;
    this.error = null;

    this.songService.getSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las canciones';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  getImageUrl(photo: string): string {
    if (!photo) return 'assets/img/default-image.jpeg';
    return `http://localhost:9001/images/songs/${photo}`;
  }

  formatDuration(duration: number): string {
    if (!duration) return '--:--';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  showAlert(type: 'success' | 'error', message: any) {
    Swal.fire({
      title: message,
      icon: type,
      timer: 4000,
      showConfirmButton: false
    });
  }
  onDeleteSong(songId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta canción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.songService.deleteSong(songId).subscribe({
          next: () => {
            this.loadSongs();
            this.showAlert('success', 'Canción eliminada exitosamente');
          },
          error: (err) => {
            console.error('Error al eliminar la canción:', err);
            this.showAlert('error', 'Error al eliminar la canción');
          }
        });
      }
    });
  }

  onEditSong(song: any): void {
    this.selectedSong = song;
    this.showUpdateModal = true;
  }

  onUpdateSuccess(updatedSong: any): void {
    this.loadSongs(); // Recargar la lista
    this.showUpdateModal = false;
  }

  openAddSongModal(): void {
    this.showAddModal = true;
  }

  onAddSuccess(newSong: any): void {
    this.loadSongs(); // Recargar la lista
    this.showAddModal = false;
    this.showAlert('success', 'Canción agregada exitosamente');
  }



  openSongInfoModal(song: any) {
    this.songToShow = song;
    this.showInfoModal = true;
  }

  closeSongInfoModal() {
    this.showInfoModal = false;
    this.songToShow = null;
  }

  //cargar playlist del usuario
  loadUserPlaylists(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.playlistsService.getPlaylistsByUser(user.id).subscribe({
        next: (playlists) => {
          this.userPlaylists = playlists;
        },
        error: (err) => {
          console.error('Error al cargar las playlists del usuario:', err);
        }
      });
    }
  }
  //Seleccion de la cancion para agregar

  onAddToPlaylist(songId: string, event: Event): void {
    event.stopPropagation();
    this.currentSelectedSongId = songId;
    this.loadUserPlaylists();
  }

  // Método para agregar canción a una playlist específica con validación de duplicados
  addSongToSelectedPlaylist(playlistId: string): void {
    if (!this.currentSelectedSongId) return;

    // Primero verificamos si la canción ya está en la playlist (validación frontend)
    const playlist = this.userPlaylists.find(p => p.id === playlistId);
    if (playlist && playlist.canciones.some((song: any) => song.id === this.currentSelectedSongId)) {
      this.showAlert('error', 'Esta canción ya está en la playlist');
      this.currentSelectedSongId = null;
      return;
    }

    this.playlistsService.addSongToPlaylist(playlistId, this.currentSelectedSongId).subscribe({
      next: () => {
        this.showAlert('success', 'Canción agregada a la playlist exitosamente');
        this.currentSelectedSongId = null;
        // Actualizamos la lista de playlists para reflejar el cambio
        this.loadUserPlaylists();
      },
      error: (err) => {
        console.error('Error al agregar canción a la playlist:', err);
        const errorMessage = err.message.includes('already exists') ?
          'Esta canción ya está en la playlist' :
          'Error al agregar canción a la playlist';
        this.showAlert('error', errorMessage);
      }
    });
  }


}


