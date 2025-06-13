import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router } from '@angular/router';
import { RegisterReq } from '../login/interfaces/register.interface';
import { RegisterService } from './service/register.service';
import Swal from 'sweetalert2';
import { AuthService } from '../login/services/auth.service';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  private readonly router: Router = inject(Router);
  private readonly registerService: RegisterService = inject(RegisterService);
  public authService: AuthService = inject(AuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  public loading = signal(false);
  public show = signal(true);
  public userLogin = this.registerService.user;

  public formRegister = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    lastName: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    salary: ['', [Validators.required, Validators.minLength(3), Validators.max(10000000), Validators.pattern(/^[0-9]*$/)]],
  });

  constructor (){
    // effect(() => {
    //   if (this.userLogin()) {
    //     this.router.navigate(['/private/dashboard']);
    //   }
    // }, { manualCleanup: true });
  }

  campoNoEsValido(campo: 'name' | 'lastName' | 'email' | 'password' | 'salary'): string | boolean {
    const control = this.formRegister.get(campo);
    if (!control) return false;

    if (control.errors) {
      if (control.errors['required'] && control.touched) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['minlength'] && control.touched) {
        return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern'] && control.touched) {
        if (campo === 'email') {
          return 'Ingrese un correo electrónico válido';
        }
        return 'Formato inválido';
      }
      if (control.errors['min'] && control.touched) {
        return `El valor mínimo es ${control.errors['min'].min}`;
      }
      if (control.errors['max'] && control.touched) {
        return `El valor máximo es ${control.errors['max'].max}`;
      }
    }
    return false;
  }

  onlyNumbers(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  goto(path: string): void {
    this.router.navigate([path]);
  }

  onSubmit() {
    const body: RegisterReq = {
      name: this.formRegister.get('name')?.value!,
      last_name: this.formRegister.get('lastName')?.value!,
      email: this.formRegister.get('email')?.value!,
      password: this.formRegister.get('password')?.value!,
      salary: Number(this.formRegister.get('salary')?.value!),
      google: false
    }
    this.loading.set(true);
    this.show.set(false);
    this.authService.register(body).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.show.set(true);
        this.router.navigate(['/private/dashboard']);
      },
      error: async (err) => {
        console.log('err', err);
        this.loading.set(false);
        this.show.set(true);
      },
    })
  }
}
