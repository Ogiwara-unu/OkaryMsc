import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { GET_SONGS_QUERY, GET_SONG_IMAGE_QUERY } from '../grahpql/queries';

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
}