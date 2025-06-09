import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../Components/navbar/navbar.component';
import {Developer} from '../../Services/developer.model';
import { GithubService } from '../../Services/github.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NavbarComponent,CommonModule, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  developers: Developer[] = [];
  usernames: string[] = ['Ogiwara-unu', 'ValeeFernandez', 'Chrisvilla2603'];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getAllUsers(this.usernames).subscribe((data) => {
      this.developers = data;
    });
  }
}