import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GET_USERS_QUERY, GET_USER_BY_ID_QUERY } from '../grahpql/queries';
import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from '../grahpql/mutations';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private apollo: Apollo) { }

  getUsers(limit: number = 10): Observable<User[]> {
    return this.apollo.watchQuery<any>({
      query: GET_USERS_QUERY,
      variables: { limit },
      errorPolicy: 'all'
    })
    .valueChanges
    .pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.usuarios?.items || [];
      }),
      catchError((error: any) => {
        console.error('Error completo:', error);
        let errorMsg = 'Error al obtener los usuarios';
        if (error.networkError) {
          errorMsg = 'Error de conexión con el servidor';
        } else if (error.graphQLErrors?.length > 0) {
          errorMsg = error.graphQLErrors[0].message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.apollo.watchQuery<any>({
      query: GET_USER_BY_ID_QUERY,
      variables: { id },
      errorPolicy: 'all'
    })
    .valueChanges
    .pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.usuario;
      }),
      catchError((error: any) => {
        console.error('Error completo:', error);
        let errorMsg = 'Error al obtener el usuario';
        if (error.networkError) {
          errorMsg = 'Error de conexión con el servidor';
        } else if (error.graphQLErrors?.length > 0) {
          errorMsg = error.graphQLErrors[0].message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createUser(input: { username: string; email: string; password: string; role?: string }): Observable<User> {
    return this.apollo.mutate<any>({
      mutation: CREATE_USER_MUTATION,
      variables: { input }
    })
    .pipe(
      map(result => result.data.crearUsuario),
      catchError(error => {
        console.error('Error al crear el usuario:', error);
        return throwError(() => new Error('Error al crear el usuario'));
      })
    );
  }

  updateUser(id: string, input: { username: string; email: string; role?: string }): Observable<User> {
    const token = sessionStorage.getItem('token');
    return this.apollo.mutate<any>({
      mutation: UPDATE_USER_MUTATION,
      variables: { id, input },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.actualizarUsuario),
      catchError(error => {
        console.error('Error al actualizar el usuario:', error);
        return throwError(() => new Error('Error al actualizar el usuario'));
      })
    );
  }

  deleteUser(id: string): Observable<User> {
    const token = sessionStorage.getItem('token');
    console.log(token);
    return this.apollo.mutate<any>({
      mutation: DELETE_USER_MUTATION,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
    .pipe(
      map(result => result.data.eliminarUsuario),
      catchError(error => {
        console.error('Error al eliminar el usuario:', error);
        return throwError(() => new Error('Error al eliminar el usuario'));
      })
    );
  }

}
