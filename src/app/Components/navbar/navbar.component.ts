import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAdmin = false;
  private intervalId: any;
  private subscription!: Subscription;
  isLoggedIn = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
  this.subscription = this.authService.currentUser$.subscribe(user => {
    this.isAdmin = user?.role === 'admin';
    this.isLoggedIn = !!user; 
    console.log(this.isAdmin ? 'El usuario logeado es admin' : 'El usuario logeado no es admin');
  });
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  
}
