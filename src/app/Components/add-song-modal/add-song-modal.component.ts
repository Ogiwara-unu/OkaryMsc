import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../../Services/songs.service';
import { FileService } from '../../Services/file.service';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-add-song-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-song-modal.component.html',
  styleUrl: './add-song-modal.component.css'
})
export class AddSongModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() addSuccess = new EventEmitter<any>();

  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      album: [''],
      genre: [''],
      duration: [0, [Validators.required, Validators.min(1)]],
      lyrics: [''],
      photo: ['']
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      const songData = this.form.value;

      const finish = (photoFilename?: string) => {
        if (photoFilename) songData.photo = photoFilename;

        this.songService.addSong(songData).subscribe({
          next: (newSong) => {
            this.isLoading = false;
            this.successMessage = 'Canción agregada correctamente';
            this.addSuccess.emit(newSong);
            setTimeout(() => this.close.emit(), 1200);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error al agregar la canción';
          }
        });
      };

      // Si hay archivo seleccionado, súbelo primero
      if (this.selectedFile) {
        this.fileService.uploadSongImage(this.selectedFile).subscribe({
          next: (res) => {
            finish(res.filename);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.message || 'Error al subir la imagen';
          }
        });
      } else {
        finish();
      }
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.form.patchValue({ photo: '' });
  }

  onClose(): void {
    this.close.emit();
  }
}