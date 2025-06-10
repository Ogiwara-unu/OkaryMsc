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
export const DELETE_SONG_MUTATION = gql`
  mutation DeleteSong($id: ID!) {
    eliminarCancion(id: $id) {
      id
      title
    }
  }
`;
export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: ID!) {
    usuario(id: $id) {
      id
      username
      email
      role
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query GetUsers($limit: Int) {
    usuarios(limit: $limit) {
      items {
        id
        username
        email
        role
      }
    }
  }
`;


export const GET_ALBUMS_QUERY = gql`
  query GetAlbums($limit: Int) {
    albums(limit: $limit) {
      items {
        id
        title
        artist
        year
        genre
        photo
      }
    }
  }
`;

export const GET_ALBUM_BY_ID_QUERY = gql`
  query GetAlbumById($id: ID!) {
    album(id: $id) {
      id
      title
      artist
      year
      genre
      photo
    }
  }
`;

// Opcional: Query para obtener solo la foto de un álbum
export const GET_ALBUM_PHOTO_QUERY = gql`
  query GetAlbumPhoto($id: ID!) {
    album(id: $id) {
      photo
    }
  }
`;