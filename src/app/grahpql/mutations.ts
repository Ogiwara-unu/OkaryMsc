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