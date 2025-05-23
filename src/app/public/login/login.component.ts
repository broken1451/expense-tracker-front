import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginReq } from './interfaces/login.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit {

  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  public userLogin = this.authService.user;
  public loading = signal(false);


  public loginForm = this.fb.group({
    email: ['', [ Validators.pattern(/^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-zA-Z]{2,5})$/)]],  
    // password:['', [Validators.required, Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$/)]],
    password:['', [Validators.required]],
  });

  get formsValue () {
    return this.loginForm.controls; 
  }

  constructor (){
    effect(() => {
      if (this.userLogin()) {
        this.router.navigate(['/private/dashboard']);
      }
    }, { manualCleanup: true });
  }

  ngOnInit(): void {
    
  }

  goto(path: string): void {
    this.router.navigate([path]);
  }

  onSubmit() {
    this.loading.set(true);
    const body: LoginReq = {
      email: this.formsValue.email.value ?? '',
      password: this.formsValue.password.value ?? ''
    }
    
    this.authService.login(body)  
    .subscribe({
      next: (res) => {
        this.loading.set(true);
        // this.loading =(true);
        this.userLogin();
      },
      error: async (err) => {
      console.log('err', err);
      this.loading.set(false);
       await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  campoNoEsValido (campo: 'email' | 'password'): any {
    return this.loginForm?.controls[campo]?.errors && (this.loginForm?.controls[campo]?.touched || this.loginForm?.controls[campo]?.errors?.['pattern']?.requiredPattern); 
  }

}
