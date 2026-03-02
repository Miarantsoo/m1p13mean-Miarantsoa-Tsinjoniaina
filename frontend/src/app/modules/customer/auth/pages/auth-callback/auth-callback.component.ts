import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@/core/services/http/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: false,
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer le token et les informations de l'utilisateur depuis les query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userStr = params['user'];
      const error = params['error'];

      if (error) {
        this.errorMessage = 'Échec de la connexion avec Google';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
        return;
      }

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));

          // Sauvegarder le token et l'utilisateur
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_info', JSON.stringify(user));

          // Mettre à jour le BehaviorSubject
          (this.authService as any).currentUserSubject.next(user);

          // Rediriger selon le rôle
          if (user.role === 'admin') {
            this.router.navigate(['/admin/planning']);
          } else if (user.role === 'shop') {
            this.router.navigate(['/shop/dashboard']);
          } else {
            this.router.navigate(['/customer']);
          }
        } catch (e) {
          this.errorMessage = 'Erreur lors du traitement de la réponse';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }
      } else {
        this.errorMessage = 'Paramètres manquants';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      }
    });
  }
}
