import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { GlobalLoading } from '../../components/global-loading/global-loading';
import { RemindersService } from '../../services/reminders';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { IReminder } from '../../interfaces/reminder.interface';
import { DatePipe } from '@angular/common';
import { Auth } from '../../services/auth';
import { CookieService } from 'ngx-cookie-service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-reminder-details',
  imports: [GlobalLoading, DatePipe , ReactiveFormsModule],
  templateUrl: './reminder-details.html',
  styleUrl: './reminder-details.css',
})
export class ReminderDetails implements OnInit {
  private reminderService = inject(RemindersService);
  private toast = inject(ToastrService);
  private authService = inject(Auth);
  private activedRoute = inject(ActivatedRoute);
  reminderId = signal<number>(0);
  getReminderLoading = signal<boolean>(false);
  reminder = signal<IReminder | null>(null);
   updateReminderId = signal<number>(0);
   updateRemindersLoading = signal<boolean>(false);
  @ViewChild('updateReminderModal')
  updateReminderModal!: ElementRef;

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.reminderId.set(Number(id));
        this.getReminder(this.reminderId());
      }
    });
  }

  getReminder(reminderId: number) {
    this.getReminderLoading.set(true);

    this.reminderService.getReminder(reminderId).subscribe({
      next: (res) => {
        console.log(res);
        this.getReminderLoading.set(false);
        if(res){
          this.reminder.set(res);
        }
      },
      error: (err) => {
        console.log(err);
        this.getReminderLoading.set(false);
      },
    });
  }

  updateRemindersForm = new FormGroup(
    {
      reminderId: new FormControl(0),
      title: new FormControl('', [Validators.minLength(3), Validators.required]),
      description: new FormControl('', [Validators.minLength(3), Validators.required]),
      reminderDateTime: new FormControl('', Validators.required),
      isAcknowledged: new FormControl(false, Validators.required),
      userId: new FormControl(this.authService?.userId()),
    },
    { validators: [this.validateReminderDate] },
  );

  validateReminderDate(form: AbstractControl) {
    const reminderDate = form.get('reminderDateTime')?.value;
    if (!reminderDate) return null;

    const currentYear = new Date();
    const reminderYear = new Date(reminderDate);

    // 2026 ===   2025
    if (reminderYear < currentYear) {
      return { invalidYear: true }; // clearer name
    }

    return null;
  }

  setToUpdate(reminderId: number | undefined, item: any) {
    this.updateReminderId.set(reminderId!);
    (this.updateReminderModal?.nativeElement as HTMLElement).classList.remove('hidden');
    (this.updateReminderModal?.nativeElement as HTMLElement).classList.add('flex');
    this.updateRemindersForm.patchValue({ ...item });
  }

  onCloseUpdateModel() {
    (this.updateReminderModal.nativeElement as HTMLElement).classList.add('hidden');
    (this.updateReminderModal.nativeElement as HTMLElement).classList.remove('flex');
  }

  updateReminders() {
    if (this.updateRemindersForm.invalid) {
      this.updateRemindersForm.markAllAsTouched();
      return;
    }

    this.updateRemindersLoading.set(true);
    this.reminderService
      .updateReminder(this.updateReminderId(), this.updateRemindersForm.value)
      .subscribe({
        next: (res) => {
         this.toast.success('Reminder Update Successfully');
        this.updateRemindersLoading.set(false);
        this.getReminder(this.reminderId());
        this.updateRemindersForm.reset();
        this.onCloseUpdateModel();
        },
        error: (err) => {
           this.toast.error(`Can't Update A Reminder`);
        this.updateRemindersLoading.set(false);
        this.updateRemindersForm.reset();
        this.onCloseUpdateModel();
        },
      });
  }

  deleteReminder(reminderId: number) {
    this.reminderService.deleteReminder(reminderId).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success('Task Deleted Successfully');
        this.reminderService.getAllReminders(this.authService.userId());
        this.getReminderLoading.set(true);
        this.reminder.set(null);
      },
      error: (err) => {
       this.toast.error(`Can't Delete This Reminder Please Try Later Again!`);

      },
    });
  }
}
