import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthService } from 'src/app/services/auth/spotify-auth.service';

@Component({
  selector: 'app-spotify-code',
  templateUrl: './spotify-code.component.html',
  styleUrls: ['./spotify-code.component.css'],
})
export class SpotifyCodeComponent {
  code!: string;
  constructor(
    private spotifyAuth: SpotifyAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.queryParams['code'];
    this.spotifyAuth.getExchangeToken(this.code);
    this.router.navigate(['/lobby']);
  }
}
