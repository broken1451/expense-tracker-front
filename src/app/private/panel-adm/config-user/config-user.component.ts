import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateReqUser, UserFormReq } from '../interfaces/user.interfaces';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { User } from '../../panel-adm/interfaces/user.interfaces';
import { AuthService } from '../../../public/login/services/auth.service';

@Component({
  selector: 'app-config-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config-user.component.html',
  styleUrl: './config-user.component.scss'
})
export class ConfigUserComponent implements OnInit, OnDestroy {

  private readonly userService: UserService = inject(UserService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  public users = this.userService.users;
  public auxUsers = signal<User[] | null>([]);
  public showEye = signal<boolean>(false);
  public idUser = signal<string>('');
  public showEye1 = signal<boolean>(false);
  public subcription = signal<Subscription | null>(null);
  public roles = signal<{ value: string; name: string }[]>(
    [{
      value: 'ADMIN',
      name: 'Admin'
    },
    {
      value: 'USER',
      name: 'User'
    }]
  );

  get rolesArr() {
    return this.userForm.get('selectedOptions') as FormArray;
  }

  public userForm = this.fb.group({
    name: ['', []],
    last_name: ['', []],
    email: ['', []],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
    salary: ['', []],
    selectedOption: [''],
    selectedOptions: this.fb.array([]),
  }, {
    validators: [
      this.userService.isFieldOneEqualToFieldTwo('password', 'password2')
    ]
  });

  public userFormEdited = this.fb.group({
    name: ['', []],
    last_name: ['', []],
    email: ['', []],
    salary: ['', []],
    selectedOption: [''],
    selectedOptions: this.fb.array([]),
  });

  constructor() {

  }

  ngOnInit(): void {
    this.getUsers();
  }

  get selectedOptions(): FormArray {
    return this.userForm?.get('selectedOptions') as FormArray | any;
  }

  get selectedOptions2(): FormArray {
    return this.userFormEdited?.get('selectedOptions') as FormArray | any;
  }

  getUsers() {
    this.subcription.set(this.userService.getUsers().subscribe())
  }

  showHide1() {
    this.showEye1.update((prev) => !prev);
  }

  showHide() {
    this.showEye.update((prev) => !prev);
  }


  onSubmitEdit() {

    Swal.fire({
      title: 'Actualizando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const modal = document.getElementById('editUserModal');
        if (modal) {
          modal.style.display = 'none';
        }
      },
    });
    const body: UpdateReqUser = {
      name: this.userFormEdited.get('name')?.value!,
      last_name: this.userFormEdited.get('last_name')?.value!,
      email: this.userFormEdited.get('email')?.value!,
      salary: Number(this.userFormEdited.get('salary')?.value!),
      roles: this.selectedOptions2.value
    }
    this.userService.updateUser(this.idUser(), body).subscribe({
      next: (res) => {
        if (res) {
          Swal.close();
          this.userFormEdited.reset();
          while (this.selectedOptions2.length !== 0) {
            this.selectedOptions2.removeAt(0);
          }
          const userLogin = this.authService.userLogin();
          if (userLogin) {
            userLogin.user = res;
            localStorage.setItem('user', JSON.stringify(userLogin));
          }
          this.getUsers();
        }
      },
      error: async (err) => {
        console.log('err', err);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
    })

    this.userFormEdited.reset();
    while (this.selectedOptions2.length !== 0) {
      this.selectedOptions2.removeAt(0);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Creando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const modal = document.getElementById('addUserModal');
        if (modal) {
          modal.style.display = 'none';
        }
      },
    });
    const body: UserFormReq = {
      name: this.userForm.get('name')?.value!,
      last_name: this.userForm.get('last_name')?.value!,
      email: this.userForm.get('email')?.value!,
      password: this.userForm.get('password')?.value!,
      salary: Number(this.userForm.get('salary')?.value!),
      roles: this.selectedOptions.value
    }
    this.userService.createUsers(body).subscribe({
      next: (res) => {
        if (res) {
          Swal.close();
          this.userForm.reset();
          while (this.selectedOptions.length !== 0) {
            this.selectedOptions.removeAt(0);
          }
          this.getUsers();
        }
      },
      error: async (err) => {
        console.log('err', err);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
    })

    this.userForm.reset();
    while (this.selectedOptions.length !== 0) {
      this.selectedOptions.removeAt(0);
    }
  }

  addOptionToFormArray() {
    const selectedValue = this.userForm.get('selectedOption')?.value;
    if (selectedValue) {
      this.selectedOptions.push(this.fb.control(selectedValue));
    }
  }

  addOptionToFormArray2() {
    const selectedValue = this.userFormEdited.get('selectedOption')?.value;
    if (selectedValue) {
      this.selectedOptions2.push(this.fb.control(selectedValue));
    }
  }

  isValidField(field: string) {
    return this.userService.isValidField(field, this.userForm);
  }

  getFieldError(field: string): any {
    if (!this.userForm.controls[field as keyof typeof this.userForm.controls]) {
      return;
    }

    const errors = this.userForm.controls[field as keyof typeof this.userForm.controls]?.errors || {};

    for (const iterator of Object.keys(errors)) {
      switch (iterator) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `This field must have at least ${errors['minlength'].requiredLength} characters`;
        case 'min':
          return 'This field must be greater than 0';
        default:
          return 'Error';
      }
    }
  }

  ngOnDestroy() {
    this.subcription()?.unsubscribe();
  }


  updateUser(user: any) {
    this.idUser.set(user._id);
    const modal = document.getElementById('editUserModal');
    if (modal) {
      modal.style.display = 'block';
    }
    this.userFormEdited.patchValue({
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      salary: user.salary,
    });
    this.selectedOptions2.clear();
    for (const role of user.roles) {
      this.selectedOptions2.push(this.fb.control(role));
    }
  }


  removeSelectedOption(index: number) {
    this.selectedOptions.removeAt(index);
  }

  removeSelectedOption2(index: number) {
    this.selectedOptions2.removeAt(index);
  }

  cleanModalNewUser() {
    this.userForm.reset();
    while (this.selectedOptions.length !== 0) {
      this.selectedOptions.removeAt(0);
    }
  }

  deleteUser(user: User) {
    if (this.authService.user()?.user._id === user._id) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No puedes eliminar tu propio usuario',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Borrará el usuario ' + user.name,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'warning',
      confirmButtonText: '¡Sí!',
    }).then((borrar): any => {
      if (borrar.value) {
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.userService.deleteUser(user._id).subscribe({
          next: (res) => {
            this.getUsers();
            Swal.close();
            Swal.fire(
              'Eliminado',
              'El usuario ' + user.name + ' ha sido eliminado.',
              'success'
            );
          },
          error: async (err) => {
            console.error(err);
            Swal.close();
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El usuario ya se encuentra eliminado.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          `El usuario  ${user.name} ${user.last_name} está a salvo :)`,
          'info'
        );
      }
    });

  }
}
