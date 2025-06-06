import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import { environment } from '../../../../environments/environment';
import { ResumeSystemService } from './services/resume-system.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-system',
  imports: [CommonModule],
  templateUrl: './resume-system.component.html',
  styleUrl: './resume-system.component.scss'
})
export class ResumeSystemComponent implements OnInit {

  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly resumeSystemService: ResumeSystemService = inject(ResumeSystemService);
  public users = this.userService.users;
  public details = this.resumeSystemService.details;
  public userCreatedToday = signal<number>(0);
  public version = signal<string>(environment.version);
  public lastUpdate = signal<string>(this.getFormattedLastUpdate());
  public day = signal<string>('');
  public hour = signal<string>('');     

  private intervalId: any;

  private getFormattedLastUpdate(): string {
    const lastUpdateDate = dayjs(environment.lastUpdate);
    const now = dayjs();
    const updatedDate = lastUpdateDate.hour(now.hour()).minute(now.minute()).second(now.second());
    const timePart = updatedDate.format('HH:mm:ss');
    const datePart = lastUpdateDate.format('DD-MM-YYYY');   
    return `${datePart} ${timePart}`;
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.lastUpdate.set(this.getFormattedLastUpdate());
      this.day.set(this.lastUpdate().split(' ')[0]);
      this.hour.set(this.lastUpdate().split(' ')[1]);
    }, 1000);
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.userCreatedToday.set(res.users.filter(user => {
          const createdAt = dayjs(user.created_at).format('YYYY-MM-DD');
          return createdAt === dayjs().format('YYYY-MM-DD');
        }).length);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.router.navigate(['/private/dashboard']);
      },
    });
    this.getDbDetails();
  }

  public getDbDetails() {
    return this.resumeSystemService.getDbDetails().subscribe()
  }

}
