import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-info-modal',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './song-info-modal.component.html',
  styleUrl: './song-info-modal.component.css'
})
export class SongInfoModalComponent {
  @Input() song: any;
  @Output() close = new EventEmitter<void>();

  getImageUrl(photo: string): string {
    if (!photo) return 'assets/img/default-song.png';
    return `http://localhost:9001/images/songs/${photo}`;
  }

  getFormattedLyrics(lyrics: string): string {
    if (!lyrics) return '';
    const lines = lyrics.split('\n');
    const formatted = lines.map((line, index) => {
      // Agrega una línea en blanco después de cada 4 líneas (excepto la última)
      return (index + 1) % 4 === 0 ? line + '\n' : line;
    });
    return formatted.join('\n');
  }

}