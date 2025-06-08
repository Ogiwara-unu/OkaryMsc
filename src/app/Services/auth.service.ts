import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) { }

  login(email: string, password: string): Observable<string> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: { email, password },
    }).pipe(
      map((result: any) => {
        const token = result.data.login.token;
        localStorage.setItem('token', token);
        return token;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
