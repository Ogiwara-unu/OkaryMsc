import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-playlist-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-playlist-info-modal.component.html',
  styleUrl: './show-playlist-info-modal.component.css'
})
export class ShowPlaylistInfoModalComponent implements OnInit {
  playlistId: string;
  playlist: any;
  songs: any[] = [];
  loading = true;
  error: string | null = null;
   currentUser: any;
  isCreator: boolean = false;
  

  @Output() close = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { playlistId: string },
    private playlistsService: PlaylistsService
  ) {
    this.playlistId = data.playlistId;
    
  }

  ngOnInit(): void {
    this.loadPlaylistInfo();
    console.log(this.playlistId)
  }

  loadPlaylistInfo() {
    this.loading = true;
    this.error = null;

    this.playlistsService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlist = playlists.find(p => p.id === this.playlistId);
        if (this.playlist) {
          this.isCreator = this.currentUser && (this.playlist.user.id === this.currentUser.id);
          this.loadSongs();
        } else {
          this.error = 'No se encontró la playlist';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar la playlist';
        this.loading = false;
      }
    });
  }

  loadSongs() {
    this.playlistsService.getSongsByPlaylist(this.playlistId).subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar las canciones';
        this.loading = false;
      }
    });
  }

  onRemoveSong(songId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la canción de la playlist',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/assets/img/audio-wave.gif")
        left top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        this.playlistsService.removeSongFromPlaylist(this.playlistId, songId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminada!',
              text: 'La canción ha sido removida de la playlist.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            // Actualizar la lista de canciones
            this.loadSongs();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.message || 'No se pudo eliminar la canción',
              icon: 'error',
              timer: 3000
            });
          }
        });
      }
    });
  }
}
