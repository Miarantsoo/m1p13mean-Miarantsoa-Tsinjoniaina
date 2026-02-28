import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginUserRequest} from '@/modules/customer/auth/models/user.model';
import {AuthService} from '@/core/services/http/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
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
          this.router.navigate(['/admin/planning']);
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
