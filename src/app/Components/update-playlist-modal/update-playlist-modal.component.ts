import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlaylistsService } from '../../Services/play-list-modal.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { ErrorComponent } from '../error/error.component';


@Component({
  selector: 'app-update-playlist-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './update-playlist-modal.component.html',
  styleUrl: './update-playlist-modal.component.css'
})
export class UpdatePlaylistModalComponent {
  @Input() playlist: any;
  @Output() close = new EventEmitter<void>();
  @Output() updateSuccess = new EventEmitter<any>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
      private fb: FormBuilder,
      private playListService: PlaylistsService,
    ) {
      this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    }

    ngOnInit(): void {
    if (this.playlist) {
      this.form.patchValue(this.playlist);
    }
  }

  submit(): void {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const playlistData = this.form.value;
      console.log('Datos de la playlist:', playlistData);

        this.playListService.updatePlaylist(this.playlist.id, playlistData).subscribe({
          next: (updatedPlaylist) => {
            this.isLoading = false;
            this.successMessage = 'Playlist actualizada correctamente';
            this.updateSuccess.emit(updatedPlaylist);
            setTimeout(() => this.close.emit(), 1200);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error al actualizar la canción';
          }
        });
      
    }
  }

  onClose(): void {
    this.close.emit();
  }

}
