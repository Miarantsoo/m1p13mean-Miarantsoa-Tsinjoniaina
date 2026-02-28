import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserRequest } from '../../models/user.model';
import {AuthService} from '@/core/services/http/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone_number: ['', [Validators.required]]
    });
  }

  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    let formatted = '';
    if (value.length > 0) {
      formatted = value.substring(0, 2);
    }
    if (value.length > 2) {
      formatted += ' ' + value.substring(2, 4);
    }
    if (value.length > 4) {
      formatted += ' ' + value.substring(4, 7);
    }
    if (value.length > 7) {
      formatted += ' ' + value.substring(7, 9);
    }

    input.value = formatted;
    this.registerForm.patchValue({ phone_number: formatted }, { emitEvent: false });
  }

  onSubmit(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const phoneNumber = this.registerForm.value.phone_number.replace(/\s/g, '');
      const fullPhoneNumber = '261' + phoneNumber;

      const userData: RegisterUserRequest = {
        ...this.registerForm.value,
        phone_number: fullPhoneNumber,
        role: 'customer' as const
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
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
}
