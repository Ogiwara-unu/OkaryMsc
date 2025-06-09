import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Developer } from './developer.model';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<Developer> {
    return this.http.get<Developer>(`https://api.github.com/users/${username}`);
  }

  getAllUsers(usernames: string[]): Observable<Developer[]> {
    return forkJoin(usernames.map(this.getUser.bind(this)));
  }
}
