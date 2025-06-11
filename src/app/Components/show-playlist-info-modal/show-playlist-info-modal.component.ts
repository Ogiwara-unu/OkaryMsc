import { Component, Inject, OnInit, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistsService } from '../../Services/play-list-modal.service'; 
import { CommonModule } from '@angular/common';

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
}
