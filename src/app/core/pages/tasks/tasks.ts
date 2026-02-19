import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Task } from '../../services/task';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { ITask } from '../../interfaces/task';
import { GlobalLoading } from '../../components/global-loading/global-loading';
import { RouterLink } from "@angular/router";
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, ReactiveFormsModule, GlobalLoading, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {

  private taskService = inject(Task);
  private authService = inject(Auth);
  private toast = inject(ToastrService);
  // todayDate = new Date().toISOString().split('T')[0];

  isLoadingCreateTask = signal<boolean>(false);
  taskList: ITask[] = [];
  isLoadingOfGetAllTasks = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  existId = signal<number>(0);
  updateableId = signal<number>(0);
  updateLoading = signal<boolean>(false);

  @ViewChild('createTaskModel') createTaskModel!: ElementRef;
  @ViewChild('updateTaskModal') updateTaskModal!: ElementRef;

  // 🔹 Factory Method لتجنب التكرار
  private buildTaskForm() {
    return new FormGroup(
      {
        taskId: new FormControl(0),
        taskName: new FormControl('', [Validators.minLength(3), Validators.required]),
        description: new FormControl('', [Validators.minLength(3), Validators.required]),
        frequency: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(Daily|Weekly|Monthly)$/),
        ]),
        createdDate: new FormControl(new Date()),
        startDate: new FormControl(new Date()),
        dueDate: new FormControl('', [Validators.required]),
        isCompleted: new FormControl(false),
        userId: new FormControl(Number(this.authService.userId())),
      },
      { validators: [this.validtionOnCreateTaskForm] }
    );
  }

  createTaskForm = this.buildTaskForm();
  updateTaskForm = this.buildTaskForm();

  // 🔹 Validation محسنة
  validtionOnCreateTaskForm(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const due = group.get('dueDate')?.value;

    if (start && due && new Date(due) < new Date(start)) {
      group.get('dueDate')?.setErrors({ invalidDateRange: true });
      return { invalidDateRange: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.getAllTasksByUserId();
  }

  // =============================
  // CREATE
  // =============================

  createTask() {
    if (this.createTaskForm.invalid) {
      this.createTaskForm.markAllAsTouched();
      return;
    }

    this.isLoadingCreateTask.set(true);

    this.taskService.createTask(this.createTaskForm.value)
      .pipe(finalize(() => this.isLoadingCreateTask.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Task Created Successfully');
          this.getAllTasksByUserId();
          this.createTaskForm = this.buildTaskForm();
          this.onCloseModel();
        },
        error: () => {
          this.toast.error(`Can't Create A Task`);
        },
      });
  }

  onOpenModel() {
    this.toggleModal(this.createTaskModel, true);
  }

  onCloseModel() {
    this.toggleModal(this.createTaskModel, false);
  }

  // =============================
  // GET
  // =============================

  getAllTasksByUserId() {
    this.isLoadingOfGetAllTasks.set(true);

    this.taskService.getAllTasks(this.authService.userId())
      .pipe(finalize(() => this.isLoadingOfGetAllTasks.set(false)))
      .subscribe({
        next: (res) => this.taskList = res,
        error: () => this.toast.error('Failed To Load Tasks'),
      });
  }

  // =============================
  // DELETE
  // =============================

  deleteTask(taskId: number) {
    this.existId.set(taskId);
    this.deleteLoading.set(true);

    this.taskService.deleteTask(taskId)
      .pipe(finalize(() => this.deleteLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Task Deleted Successfully');
          this.getAllTasksByUserId();
        },
        error: () => {
          this.toast.error(`Can't Delete This Task Please Try Later Again!`);
        },
      });
  }

  // =============================
  // UPDATE
  // =============================

  setToUpdate(updateableId: number, item: any) {
    this.updateableId.set(updateableId);
    this.updateTaskForm.patchValue({ ...item });
    this.toggleModal(this.updateTaskModal, true);
  }

  closeUpdateModel() {
    this.toggleModal(this.updateTaskModal, false);
  }

  updateTask() {
    if (this.updateTaskForm.invalid) {
      this.updateTaskForm.markAllAsTouched();
      return;
    }

    this.updateLoading.set(true);

    this.taskService.updateTask(this.updateableId(), { ...this.updateTaskForm.value })
      .pipe(finalize(() => this.updateLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Task Update Successfully');
          this.getAllTasksByUserId();
          this.updateTaskForm = this.buildTaskForm();
          this.closeUpdateModel();
        },
        error: () => {
          this.toast.error(`Can't Update A Task`);
        },
      });
  }

  // =============================
  // 🔹 Reusable Modal Handler
  // =============================

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
