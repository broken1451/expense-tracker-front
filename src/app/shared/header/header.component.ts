import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../public/login/services/auth.service';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { RegisterService } from '../../public/register/service/register.service';

export let browserRefresh = false;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private authService: AuthService = inject(AuthService);
  private readonly registerService: RegisterService = inject(RegisterService);
  private router: Router = inject(Router);
  public userLogin = this.authService.user;
  public isVisible = signal<boolean>(false);
  public isAdmin = signal<boolean>(false);
  public isVisibleMenu = signal<boolean>(false);
  public userLoginRegister = this.registerService.user;

  constructor() {
    effect(() => {
      if (this.userLogin()?.user.roles.includes('ADMIN') || this.userLoginRegister()?.returnUserCreated.roles.includes('ADMIN')) {
        this.isAdmin.set(true);
        this.isVisibleMenu.set(true);
        this.isVisibleMenu.set(JSON.parse(localStorage.getItem('isVisible')!))
        return
      }
      this.isVisible.set(false);
      this.isVisibleMenu.set(false);
      this.isAdmin.set(false);
    }, { manualCleanup: true });

 this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects
      ) {
          this.isVisibleMenu.set(false)
          this.router.navigate(['/private/dashboard']);
          localStorage.setItem('isVisible', JSON.stringify(this.isVisibleMenu()));
      }
    })

  }
  public logout() {
    this.authService.logout();
    this.router.navigate(['/public/login']);
  }

  public hideOptions(){
    this.isVisibleMenu.update(visible => !visible);
    localStorage.setItem('isVisible', JSON.stringify(this.isVisibleMenu()));
    if (!this.isVisibleMenu()) {
      this.router.navigate(['/private/dashboard']);
      return
    }
  }




}
