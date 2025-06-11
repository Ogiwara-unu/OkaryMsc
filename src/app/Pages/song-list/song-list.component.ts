import { Component, OnInit } from '@angular/core';
import { SongService } from '../../Services/songs.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import { FooterComponent } from '../../Components/footer/footer.component';
import { AuthService } from '../../Services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UpdateSongModalComponent } from '../../Components/update-song-modal/update-song-modal.component';
import { AddSongModalComponent } from '../../Components/add-song-modal/add-song-modal.component';
import Swal from 'sweetalert2';
import { SongInfoModalComponent } from '../../Components/song-info-modal/song-info-modal.component';

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
    SongInfoModalComponent
  ],
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
  songs: any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin: boolean = false;

  showUpdateModal = false;
  selectedSong: any = null;
  showAddModal = false;
  showInfoModal = false;
  songToShow: any = null;

  constructor(
    private songService: SongService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadSongs();
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
}


