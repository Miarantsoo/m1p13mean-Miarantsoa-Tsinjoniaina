import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginUserRequest} from '@/modules/customer/auth/models/user.model';
import {AuthService} from '@/core/services/http/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private route = inject(ActivatedRoute);

  private redirectUrl = ""
  private isCheckout = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/planning';
    this.isCheckout = this.route.snapshot.queryParams['checkout'] === 'true';
  }

  onSubmit(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData: LoginUserRequest = {
        ...this.registerForm.value,
      };

      this.authService.login(userData).subscribe({
        next: () => {
          const role = this.authService.getCurrentUser()?.role;

          if (this.isCheckout && (role === 'customer' || !role)) {
            // Retour vers le front-office avec le flag checkout
            const returnUrl = this.redirectUrl || '/';
            this.router.navigate([returnUrl], {
              queryParams: { checkout: 'true' }
            });
            return;
          }

          if (role === 'admin') {
            this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/planning';
          } else if (role === 'shop') {
            this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/shop/dashboard';
          } else if (role === 'customer'){
            this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          }
          this.router.navigate([this.redirectUrl]);
        },
        error: (error) => {
          console.log(error.error?.message);
          this.errorMessage = error.error?.message || 'Une erreur est survenue';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  loginToGoogle(): void {
    this.authService.loginGoogle();
  }
}
