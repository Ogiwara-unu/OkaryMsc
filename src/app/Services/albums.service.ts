import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  GET_ALBUMS_QUERY,
  GET_ALBUM_BY_ID_QUERY
} from '../grahpql/queries';
import {
  CREATE_ALBUM_MUTATION,
  UPDATE_ALBUM_MUTATION,
  DELETE_ALBUM_MUTATION
} from '../grahpql/mutations';

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  genre?: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  constructor(private apollo: Apollo, private http: HttpClient) { }

  // Obtiene los nombres de las fotos leyendo el HTML del directorio
  getAlbumPhotos(): Observable<string[]> {
    return this.http.get('http://localhost:9001/images/albums/', { responseType: 'text' }).pipe(
      map(html => {
        // Extrae los nombres de los archivos de imagen del HTML de listado de directorio
        const regex = /href="([^"]+\.(jpg|jpeg|png|gif))"/gi;
        const matches = [...html.matchAll(regex)];
        return matches.map(m => decodeURIComponent(m[1]));
      })
    );
  }

  uploadAlbumPhoto(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ filename: string }>(
      'http://localhost:9001/api/upload-album-image',
      formData
    );
  }

  getAlbums(limit: number = 10): Observable<Album[]> {
  return this.apollo.watchQuery<any>({
    query: GET_ALBUMS_QUERY,
    variables: { limit },
    fetchPolicy: 'network-only', // Fuerza a obtener siempre del backend, no del caché
    errorPolicy: 'all'
  })
  .valueChanges
  .pipe(
    map(result => {
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      // Ajusta según tu backend: albums o albums.items
      return result.data?.albums?.items || [];
    }),
    catchError((error: any) => {
      console.error('Error completo:', error);
      let errorMsg = 'Error al obtener los álbumes';
      if (error.networkError) {
        errorMsg = 'Error de conexión con el servidor';
      } else if (error.graphQLErrors?.length > 0) {
        errorMsg = error.graphQLErrors[0].message;
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}

  getAlbumById(id: string): Observable<Album> {
    return this.apollo.watchQuery<any>({
      query: GET_ALBUM_BY_ID_QUERY,
      variables: { id },
      errorPolicy: 'all'
    })
    .valueChanges
    .pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.album;
      }),
      catchError((error: any) => {
        console.error('Error completo:', error);
        let errorMsg = 'Error al obtener el álbum';
        if (error.networkError) {
          errorMsg = 'Error de conexión con el servidor';
        } else if (error.graphQLErrors?.length > 0) {
          errorMsg = error.graphQLErrors[0].message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createAlbum(input: Omit<Album, 'id'>): Observable<Album> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No autorizado: token requerido'));
    }
    return this.apollo.mutate<any>({
      mutation: CREATE_ALBUM_MUTATION,
      variables: { input },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.crearAlbum),
      catchError(error => {
        console.error('Error al crear el álbum:', error);
        return throwError(() => new Error('Error al crear el álbum'));
      })
    );
  }

  private cleanAlbumInput(input: any) {
    const allowed = ['title', 'artist', 'year', 'genre', 'photo'];
    const cleaned: any = {};
    for (const key of allowed) {
      if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
        cleaned[key] = input[key];
      }
    }
    return cleaned;
  }

  updateAlbum(id: string, input: Partial<Omit<Album, 'id'>>): Observable<Album> {
    const token = sessionStorage.getItem('token');
    const cleanedInput = this.cleanAlbumInput(input);
    console.log('UpdateAlbum variables:', { id, input: cleanedInput });
    return this.apollo.mutate<any>({
      mutation: UPDATE_ALBUM_MUTATION,
      variables: { id, input: cleanedInput }, // <-- id separado de input
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.actualizarAlbum),
      catchError(error => {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          console.error('GraphQL error:', error.graphQLErrors[0].message);
        }
        if (error.networkError) {
          console.error('Network error:', error.networkError);
        }
        console.error('Error al actualizar el álbum:', error);
        return throwError(() => new Error('Error al actualizar el álbum: ' + (error.graphQLErrors?.[0]?.message || error.message)));
      })
    );
  }

  deleteAlbum(id: string): Observable<Album> {
    const token = sessionStorage.getItem('token');
    return this.apollo.mutate<any>({
      mutation: DELETE_ALBUM_MUTATION,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.eliminarAlbum),
      catchError(error => {
        console.error('Error al eliminar el álbum:', error);
        return throwError(() => new Error('Error al eliminar el álbum'));
      })
    );
  }
}