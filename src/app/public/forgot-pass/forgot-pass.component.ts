import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../register/service/register.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { RecoverPassReq } from '../login/interfaces/register.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-pass',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.scss'
})
export class ForgotPassComponent {

  private readonly registerService: RegisterService = inject(RegisterService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  public loading = signal(false);
  public show = signal(true);

  public formRecoverPass = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });


  campoNoEsValido(campo: 'name' | 'lastName' | 'email' | 'password' | 'salary'): string | boolean {
    const control = this.formRecoverPass.get(campo);
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

  goto(path: string): void {
    this.router.navigate([path]);
  }

  onSubmit() {
    const formData: RecoverPassReq = {
      email: this.formRecoverPass.get('email')?.value!,
      password: this.formRecoverPass.get('password')?.value!,
    }
    this.loading.set(true);
    this.show.set(false);
    this.registerService.recoverPass(formData).subscribe({
      next: async (res) => {
        this.loading.set(false);
        this.show.set(true);
        await Swal.fire({
          icon: "success",
          title: "Correo de confirmación enviado",
          text: `Se ha enviado un correo de confirmación para el cambio de contraseña a ${formData.email}`,
          timer: 4000,
          showConfirmButton: false,
        });
        this.formRecoverPass.reset();
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.show.set(true);
      }
    });
  }

}
