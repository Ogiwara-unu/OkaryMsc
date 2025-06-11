import { ApplicationConfig, inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimations } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
        const httpLink = inject(HttpLink);
        // Middleware para añadir el token JWT como Bearer Token
        const authLink = setContext((operation, { headers }) => {
            const publicOperations = ['GetSongs', 'GetSongImage', 'GetAlbums', 'GetAlbumImage'];
            // Verifica si es una operación pública
            if (operation.operationName && publicOperations.includes(operation.operationName)) {
                return { headers };
            }
            // Para operaciones no públicas, añade el token si existe
            const token = sessionStorage.getItem('token');
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : '',
                },
            };
        });
        return {
            link: authLink.concat(httpLink.create({
                uri: 'http://localhost:9001/okaryMsc',
            })),
            cache: new InMemoryCache(),
        };
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};