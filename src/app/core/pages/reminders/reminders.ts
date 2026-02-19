import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../services/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RemindersService } from './../../services/reminders';
import { IReminder } from '../../interfaces/reminder.interface';
import { GlobalLoading } from "../../components/global-loading/global-loading";
import { RouterLink } from "@angular/router";
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reminders',
  imports: [ReactiveFormsModule, GlobalLoading, DatePipe, RouterLink],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css',
})
export class Reminders implements OnInit {

  private toast = inject(ToastrService);
  private reminderService = inject(RemindersService);
  private authService = inject(Auth);

  reminderList!: IReminder[];

  createRemindersLoading = signal<boolean>(false);
  getRemindersLoading = signal<boolean>(false);
  updateRemindersLoading = signal<boolean>(false);
  updateReminderId = signal<number>(0);

  @ViewChild('createReminderModal') createReminderModal!: ElementRef;
  @ViewChild('updateReminderModal') updateReminderModal!: ElementRef;

  ngOnInit(): void {
    this.getAllReminders(this.authService.userId());
  }

  // =============================
  // 🔹 Factory Form Builder
  // =============================

  private buildReminderForm() {
    return new FormGroup(
      {
        reminderId: new FormControl(0),
        title: new FormControl('', [Validators.minLength(3), Validators.required]),
        description: new FormControl('', [Validators.minLength(3), Validators.required]),
        reminderDateTime: new FormControl('', Validators.required),
        isAcknowledged: new FormControl(false),
        userId: new FormControl(this.authService.userId()),
      },
      { validators: [this.validateReminderDate] }
    );
  }

  createRemindersForm = this.buildReminderForm();
  updateRemindersForm = this.buildReminderForm();

  // =============================
  // 🔹 Validation محسنة
  // =============================

  validateReminderDate(form: AbstractControl) {
    const reminderDate = form.get('reminderDateTime')?.value;
    if (!reminderDate) return null;

    const now = new Date();
    const selectedDate = new Date(reminderDate);

    if (selectedDate <= now) {
      return { invalidDate: true };
    }

    return null;
  }

  // =============================
  // GET
  // =============================

  getAllReminders(userId: number) {
    this.getRemindersLoading.set(true);

    this.reminderService.getAllReminders(userId)
      .pipe(finalize(() => this.getRemindersLoading.set(false)))
      .subscribe({
        next: (res) => this.reminderList = res,
        error: () => this.toast.error('Failed To Load Reminders'),
      });
  }

  // =============================
  // CREATE
  // =============================

  createReminders() {
    if (this.createRemindersForm.invalid) {
      this.createRemindersForm.markAllAsTouched();
      return;
    }

    this.createRemindersLoading.set(true);

    this.reminderService.createReminder(this.createRemindersForm.value)
      .pipe(finalize(() => this.createRemindersLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Reminder Created Successfully');
          this.getAllReminders(this.authService.userId());
          this.createRemindersForm = this.buildReminderForm();
          this.onCloseCreateModel();
        },
        error: () => {
          this.toast.error(`The Reminder Can't Created`);
        },
      });
  }

  // =============================
  // UPDATE
  // =============================

  setToUpdate(reminderId: number | undefined, item: any) {
    this.updateReminderId.set(reminderId!);
    this.updateRemindersForm.patchValue({ ...item });
    this.toggleModal(this.updateReminderModal, true);
  }

  updateReminders() {
    if (this.updateRemindersForm.invalid) {
      this.updateRemindersForm.markAllAsTouched();
      return;
    }

    this.updateRemindersLoading.set(true);

    this.reminderService.updateReminder(
      this.updateReminderId(),
      this.updateRemindersForm.value
    )
      .pipe(finalize(() => this.updateRemindersLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('The Reminder Update Successfully');
          this.getAllReminders(this.authService.userId());
          this.updateRemindersForm = this.buildReminderForm();
          this.onCloseUpdateModel();
        },
        error: () => {
          this.toast.error(`Can't Update The Reminder`);
        },
      });
  }

  // =============================
  // DELETE
  // =============================

  deleteReminder(reminderId: number) {
    this.reminderService.deleteReminder(reminderId).subscribe({
      next: () => {
        this.toast.success(`The Reminder Deleted Success`);
        this.getAllReminders(this.authService.userId());
      },
      error: () => {
        this.toast.error(`Can't Delete This Reminder`);
      }
    });
  }

  // =============================
  // 🔹 Modal Handler موحد
  // =============================

  onOpenCreateModel() {
    this.toggleModal(this.createReminderModal, true);
  }

  onCloseCreateModel() {
    this.toggleModal(this.createReminderModal, false);
  }

  onCloseUpdateModel() {
    this.toggleModal(this.updateReminderModal, false);
  }

  private toggleModal(modal: ElementRef, open: boolean) {
    const element = modal.nativeElement as HTMLElement;

    if (open) {
      element.classList.add('flex');
      element.classList.remove('hidden');
    } else {
      element.classList.remove('flex');
      element.classList.add('hidden');
    }
  }
}
