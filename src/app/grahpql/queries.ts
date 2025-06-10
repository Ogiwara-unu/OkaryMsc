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

// Obtener Playlist por ID
export const GET_PLAYLIST_QUERY = gql`
  query GetPlaylist($id: ID!) {
    playlist(id: $id) {
      id
      name
      description
      user {
        id
        username
        email
      }
      canciones {
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

// Obtener Playlists con límite
export const GET_PLAYLISTS_QUERY = gql`
  query GetPlaylists($limit: Int) {
    playlists(limit: $limit) {
      items {
        id
        name
        description
        user {
          id
          username
        }
        canciones {
          id
          title
          artist
        }
      }
    }
  }
`;

export const GET_SONGS_BY_PLAYLIST_QUERY = gql`
  query GetPlaylist($id: ID!) {
    playlist(id: $id) {
      id
      name
      description
      canciones {
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

// Obtener Playlists por usuario
export const GET_PLAYLISTS_BY_USER_QUERY = gql`
  query GetPlaylistsByUser($userId: ID!) {
    playlistsByUser(userId: $userId) {
      id
      name
      description
      canciones {
        id
        title
        artist
      }
    }
  }
`;