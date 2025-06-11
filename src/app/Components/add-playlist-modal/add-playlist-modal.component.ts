import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-playlist-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-playlist-modal.component.html',
  styleUrl: './add-playlist-modal.component.css'
})
export class AddPlaylistModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<any>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb:FormBuilder,
    private playlistService: PlaylistsService
  ){
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  submit(): void {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      const playlistData = this.form.value;
      console.log('Datos de la playlist:', playlistData);
        this.playlistService.createPlaylist(playlistData).subscribe({
          next: (newPlaylist) => {
            this.isLoading = false;
            this.successMessage = 'Playlist agregada correctamente';
            this.success.emit(newPlaylist);
            setTimeout(() => this.close.emit(), 1200);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error al agregar la canción';
          }
        });  
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
