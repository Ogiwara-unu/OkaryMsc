import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CREATE_USER_MUTATION } from '../grahpql/mutations';
import { Apollo } from 'apollo-angular';


interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:9001';
  private currentUser: any;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private apollo: Apollo) {
    const userData = sessionStorage.getItem('user');
    this.currentUser = userData ? JSON.parse(userData) : null;
    this.currentUserSubject.next(userData ? JSON.parse(userData) : null);
   }

   isAdmin(): boolean {
    return this.currentUser?.role == 'admin';
    return this.currentUserSubject.value?.role === 'admin';
   }

    get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
    }

  
  register(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: {
        input: {
          username,
          email,
          password,
          role: 'user'
        }
      },
      context: {
        headers: {
          'No-Auth': 'True'
        }
      },
      errorPolicy: 'all' // Esto permite recibir errores de red y GraphQL
    }).pipe(
      map((result: any) => {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        return result.data?.crearUsuario;
      }),
      catchError((error: any) => {
        console.error('Error completo:', error);
        let errorMsg = 'Error en el registro';
        if (error.networkError) {
          errorMsg = 'Error de conexión con el servidor';
        } else if (error.graphQLErrors?.length > 0) {
          errorMsg = error.graphQLErrors[0].message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }



  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res: AuthResponse) => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('user', JSON.stringify(res.user));
         this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}