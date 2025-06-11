import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  CREATE_PLAYLIST_MUTATION,
  UPDATE_PLAYLIST_MUTATION,
  DELETE_PLAYLIST_MUTATION,
  ADD_SONG_TO_PLAYLIST_MUTATION,
  REMOVE_SONG_FROM_PLAYLIST_MUTATION,
} from '../grahpql/mutations';
import { GET_SONGS_BY_PLAYLIST_QUERY, GET_PLAYLIST_QUERY, GET_PLAYLISTS_QUERY,GET_PLAYLISTS_BY_USER_QUERY } from '../grahpql/queries';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration?: number;
  photo?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  user: {
    id: string;
    username: string;
  };
  canciones: Song[];
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  constructor(private apollo: Apollo) {}

  getSongsByPlaylist(playlistId: string): Observable<Song[]> {
  return this.apollo.watchQuery<any>({
    query: GET_SONGS_BY_PLAYLIST_QUERY,
    variables: { id: playlistId },
    errorPolicy: 'all'
  })
  .valueChanges
  .pipe(
    map(result => {
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data?.playlist?.canciones || [];
    }),
    catchError(error => {
      console.error('Error completo:', error);
      let errorMsg = 'Error al obtener las canciones de la playlist';
      if (error.networkError) {
        errorMsg = 'Error de conexión con el servidor';
      } else if (error.graphQLErrors?.length > 0) {
        errorMsg = error.graphQLErrors[0].message;
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}

  getPlaylists(limit?: number): Observable<Playlist[]> {
  return this.apollo.watchQuery<any>({
    query: GET_PLAYLISTS_QUERY,
    variables: { limit },
    errorPolicy: 'all'
  })
  .valueChanges
  .pipe(
    map(result => {
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data?.playlists?.items || [];
    }),
    catchError(error => {
      console.error('Error al obtener las playlists:', error);
      let errorMsg = 'Error al obtener las playlists';
      if (error.networkError) {
        errorMsg = 'Error de conexión con el servidor';
      } else if (error.graphQLErrors?.length > 0) {
        errorMsg = error.graphQLErrors[0].message;
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}

  createPlaylist(input: { name: string; description: string }): Observable<Playlist> {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user.id;
    
    return this.apollo.mutate<any>({
      mutation: CREATE_PLAYLIST_MUTATION,
      variables: {
        input: {
          ...input,
          userId
        }
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }).pipe(
      map(result => result.data.crearPlaylist),
      catchError(error => {
        console.error('Error al crear la playlist:', error);
        return throwError(() => new Error('Error al crear la playlist'));
      })
    );
  }

  updatePlaylist(id: string, input: { name: string; description: string; userId: string }): Observable<Playlist> {
    const token = sessionStorage.getItem('token');
     const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userId = user.id;
      input.userId = userId; // Aseguramos que el userId esté presente
    return this.apollo.mutate<any>({
      mutation: UPDATE_PLAYLIST_MUTATION,
      variables: {
        id: id.toString(),
        input: {
          name: input.name,
          description: input.description,
          user_Id: input.userId 
        }
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }).pipe(
      map(result => result.data.actualizarPlaylist),
      catchError(error => {
        console.error('Error al actualizar la playlist:', error);
        return throwError(() => new Error('Error al actualizar la playlist'));
      })
    );
}

  deletePlaylist(id: string): Observable<Playlist> {
    const token = sessionStorage.getItem('token');
    return this.apollo.mutate<any>({
      mutation: DELETE_PLAYLIST_MUTATION,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.eliminarPlaylist),
      catchError(error => {
        console.error('Error al eliminar la playlist:', error);
        return throwError(() => new Error('Error al eliminar la playlist'));
      })
    );
  }

  addSongToPlaylist(playlistId: string, songId: string): Observable<Playlist> {
    const token = sessionStorage.getItem('token');
    return this.apollo.mutate<any>({
      mutation: ADD_SONG_TO_PLAYLIST_MUTATION,
      variables: { playlistId, songId },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.agregarCancionAPlaylist),
      catchError(error => {
        console.error('Error al agregar canción a la playlist:', error);
        return throwError(() => new Error('Error al agregar canción a la playlist'));
      })
    );
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<Playlist> {
    const token = sessionStorage.getItem('token');
    return this.apollo.mutate<any>({
      mutation: REMOVE_SONG_FROM_PLAYLIST_MUTATION,
      variables: { playlistId, songId },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.quitarCancionDePlaylist),
      catchError(error => {
        console.error('Error al quitar canción de la playlist:', error);
        return throwError(() => new Error('Error al quitar canción de la playlist'));
      })
    );
  }

  getPlaylistsByUser(userId: string): Observable<Playlist[]> {
  const token = sessionStorage.getItem('token');

  return this.apollo.watchQuery<any>({
    query: GET_PLAYLISTS_BY_USER_QUERY,
    variables: { userId },
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    errorPolicy: 'all'
  })
  .valueChanges
  .pipe(
    map(result => {
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data?.playlistsByUser || [];
    }),
    catchError(error => {
      console.error('Error al obtener las playlists del usuario:', error);
      let errorMsg = 'Error al obtener las playlists del usuario';
      if (error.networkError) {
        errorMsg = 'Error de conexión con el servidor';
      } else if (error.graphQLErrors?.length > 0) {
        errorMsg = error.graphQLErrors[0].message;
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}

}
