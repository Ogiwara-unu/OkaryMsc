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