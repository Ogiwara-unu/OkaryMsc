import gql from 'graphql-tag';

export const GET_SONGS_QUERY = gql`
  query GetSongs($limit: Int) {
    canciones(limit: $limit) {
      items {
        id
        title
        artist
        album
        duration
        photo
      }
    }
  }
`;

export const GET_SONG_IMAGE_QUERY = gql`
  query GetSongImage($filename: String!) {
    getSongImage(filename: $filename) {
      file
      contentType
    }
  }
`;