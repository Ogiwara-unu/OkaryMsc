import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_SONGS_QUERY, GET_SONG_IMAGE_QUERY, DELETE_SONG_MUTATION } from '../grahpql/queries';
import { UPDATE_SONG_MUTATION } from '../grahpql/mutations';
import { ADD_SONG_MUTATION } from '../grahpql/mutations';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private apollo: Apollo) {}

  getSongs(limit?: number): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_SONGS_QUERY,
      variables: { limit }
    }).valueChanges.pipe(
      map((result: any) => result.data?.canciones?.items || [])
    );
  }

  getSongImage(filename: string): Observable<string> {
    return this.apollo.watchQuery({
      query: GET_SONG_IMAGE_QUERY,
      variables: { filename }
    }).valueChanges.pipe(
      map((result: any) => {
        const image = result.data?.getSongImage;
        if (image) {
          return `data:${image.contentType};base64,${image.file}`;
        }
        return '';
      })
    );
  }
  
   deleteSong(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_SONG_MUTATION,
      variables: { id },
      refetchQueries: [{ query: GET_SONGS_QUERY }] // Esto recargará la lista después de eliminar
    }).pipe(
      map((result: any) => result.data?.eliminarCancion)
    );
  }

   updateSong(id: string, input: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_SONG_MUTATION,
      variables: { id, input },
      refetchQueries: [{ query: GET_SONGS_QUERY }]
    }).pipe(
      map((result: any) => result.data?.actualizarCancion)
    );
  }

   
  addSong(input: any): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: ADD_SONG_MUTATION,
      variables: { input },
      refetchQueries: [{ query: GET_SONGS_QUERY }]
    }).pipe(
      map(result => result.data?.crearCancion),
      catchError(error => {
        console.error('Error adding song:', error);
        return throwError(() => new Error('Error al agregar la canción'));
      })
    );
  }
}