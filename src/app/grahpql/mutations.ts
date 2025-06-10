import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UsuarioInput!) {
    crearUsuario(input: $input) {
      id
      username
      email
      role
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UsuarioUpdateInput!) {
    actualizarUsuario(id: $id, input: $input) {
      id
      username
      email
      role
    }
  }
`;

export const ADD_USER_MUTATION = gql`
  mutation AddUser($input: UsuarioInput!) {
    crearUsuario(input: $input) {
      id
      username
      email
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    eliminarUsuario(id: $id) {
      id
      username
      email
      role
    }
  }
`;
export const UPDATE_SONG_MUTATION = gql`
  mutation UpdateSong($id: ID!, $input: CancionInput!) {
    actualizarCancion(id: $id, input: $input) {
      id
      title
      artist
      album
      genre
      duration
      lyrics
      photo
    }
  }
`;
export const UPLOAD_SONG_IMAGE_MUTATION = gql`
  mutation UploadSongImage($file: Upload!) {
    uploadSongImage(file: $file) {
      filename
      url
    }
  }
`;

export const ADD_SONG_MUTATION = gql`
  mutation AddSong($input: CancionInput!) {
    crearCancion(input: $input) {
      id
      title
      artist
      album
      genre
      duration
      lyrics
      photo
    }
  }
`;


export const CREATE_ALBUM_MUTATION = gql`
  mutation CreateAlbum($input: AlbumInput!) {
    crearAlbum(input: $input) {
      id
      title
      artist
      year
      genre
      photo
    }
  }
`;


export const UPDATE_ALBUM_MUTATION = gql`
  mutation UpdateAlbum($id: ID!, $input: AlbumInput!) {
    actualizarAlbum(id: $id, input: $input) {
      id
      title
      artist
      year
      genre
      photo
    }
  }
`;
export const DELETE_ALBUM_MUTATION = gql`
  mutation DeleteAlbum($id: ID!) {
    eliminarAlbum(id: $id) {
      id
      title
      artist
      year
      genre
      photo
    }
  }
`;

// --- Mutation específica para actualizar solo la foto de un álbum ---
export const UPDATE_ALBUM_PHOTO_MUTATION = gql`
  mutation UpdateAlbumPhoto($id: ID!, $photo: String!) {
    actualizarAlbumFoto(id: $id, photo: $photo) {
      id
      photo
    }
  }
`;

export const CREATE_PLAYLIST_MUTATION = gql`
  mutation CreatePlaylist($input: PlaylistInput!) {
    crearPlaylist(input: $input) {
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
      }
    }
  }
`;

// Actualizar Playlist
export const UPDATE_PLAYLIST_MUTATION = gql`
  mutation UpdatePlaylist($id: ID!, $input: PlaylistInput!) {
    actualizarPlaylist(id: $id, input: $input) {
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
      }
    }
  }
`;

// Eliminar Playlist
export const DELETE_PLAYLIST_MUTATION = gql`
  mutation DeletePlaylist($id: ID!) {
    eliminarPlaylist(id: $id) {
      id
      name
    }
  }
`;

// Agregar Canción a Playlist
export const ADD_SONG_TO_PLAYLIST_MUTATION = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    agregarCancionAPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      canciones {
        id
        title
      }
    }
  }
`;

// Quitar Canción de Playlist
export const REMOVE_SONG_FROM_PLAYLIST_MUTATION = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
    quitarCancionDePlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      canciones {
        id
        title
      }
    }
  }
`;

