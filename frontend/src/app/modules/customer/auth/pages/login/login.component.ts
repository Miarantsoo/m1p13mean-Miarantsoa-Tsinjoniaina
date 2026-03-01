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
    console.log(this.redirectUrl)
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
