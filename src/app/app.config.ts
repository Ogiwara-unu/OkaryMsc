import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      // Middleware para añadir el token JWT como Bearer Token
      const authLink = setContext((_, { headers }) => {
        const token = sessionStorage.getItem('token'); // Asegúrate de guardar el token aquí después del login
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '', // Formato: "Bearer <token>"
          },
        };
      });

      return {
        link: authLink.concat(httpLink.create({
          uri: 'http://localhost:9001/okaryMsc', // Endpoint de tu API
        })),
        cache: new InMemoryCache(),
      };
    }),
  ],

};