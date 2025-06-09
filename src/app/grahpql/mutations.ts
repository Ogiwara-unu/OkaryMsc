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