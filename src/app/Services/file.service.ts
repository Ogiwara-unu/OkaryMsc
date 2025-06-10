import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) { }

  uploadSongImage(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ filename: string }>(
      'http://localhost:9001/api/upload-song-image',
      formData
    );
  }
}