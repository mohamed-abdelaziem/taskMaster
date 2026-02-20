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
  isLoadingCreateTask = signal<boolean>(false);
  taskList: ITask[] = [];
  isLoadingOfGetAllTasks = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  existId = signal<number>(0);
  updateableId = signal<number>(0);
  @ViewChild('createTaskModel')
  createTaskModel!: ElementRef;
  updateLoading = signal<boolean>(false);

  @ViewChild('updateTaskModal')
  updateTaskModal!: ElementRef;

  createTaskForm = new FormGroup(
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
    { validators: [this.validtionOnCreateTaskForm] },
  );

  updateTaskForm = new FormGroup(
    {
      taskId: new FormControl(this.updateableId()),
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
    }, { validators: [this.validtionOnCreateTaskForm] });

  validtionOnCreateTaskForm(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const due = group.get('dueDate')?.value;

    if (new Date(due) < new Date(start)) {
      group.get('dueDate')?.setErrors(['The Due Date Must Be in Future']);
      return { invalidDateRange: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.getAllTasksByUserId();
  }

  createTask() {
    
    if (this.createTaskForm.invalid) {
      this.createTaskForm.markAllAsTouched();
      return;
    }
    this.isLoadingCreateTask.set(true);
    this.taskService.createTask(this.createTaskForm.value).subscribe({
      next: (res) => {
        this.toast.success('Task Created Successfully');
        this.isLoadingCreateTask.set(false);
        this.getAllTasksByUserId();
        this.createTaskForm.reset();
        this.onCloseModel()
      },
      error: (err) => {
        this.toast.error(`Can't Create A Task`);
        this.isLoadingCreateTask.set(false);
        this.createTaskForm.reset();
        this.onCloseModel()
      },
    });
  }

  onOpenModel() {
    (this.createTaskModel.nativeElement as HTMLElement).classList.remove('hidden');
    (this.createTaskModel.nativeElement as HTMLElement).classList.add('flex');
  }

  onCloseModel() {
    (this.createTaskModel.nativeElement as HTMLElement).classList.remove('flex');
    (this.createTaskModel.nativeElement as HTMLElement).classList.add('hidden');
  }

  getAllTasksByUserId() {
    this.isLoadingOfGetAllTasks.set(true);
    this.taskService.getAllTasks(this.authService.userId()).subscribe({
      next: (res) => {
        this.isLoadingOfGetAllTasks.set(false);
        this.taskList = res;
      },
      error: (err) => {
        this.isLoadingOfGetAllTasks.set(false);
      },
    });
  }

  deleteTask(taskId: number) {
    this.existId.set(taskId);
    this.taskService.deleteTask(taskId).subscribe({
      next: (res) => {
        this.toast.success('Task Deleted Successfully');
        this.getAllTasksByUserId();
        this.deleteLoading.set(false);
      },
      error: (err) => {
        this.toast.error(`Can't Delete This Task Please Try Later Again!`);
        this.deleteLoading.set(false);
      },
    });
  }

  setToUpdate(updateableId: number, item: any) {
    this.updateableId.set(updateableId);
    (this.updateTaskModal.nativeElement as HTMLElement).classList.add('flex');
    (this.updateTaskModal.nativeElement as HTMLElement).classList.remove('hidden');
    this.updateTaskForm.patchValue({...item});
  }

  closeUpdateModel() {
    (this.updateTaskModal.nativeElement as HTMLElement).classList.remove('flex');
    (this.updateTaskModal.nativeElement as HTMLElement).classList.add('hidden');
  }

   updateTask() {
    if (this.updateTaskForm.invalid) {
      this.updateTaskForm.markAllAsTouched();
      return;
    }
    this.updateLoading.set(true);
    this.taskService.updateTask(this.updateableId(),{...this.updateTaskForm.value}).subscribe({
      next: (res) => {
        this.toast.success('Task Update Successfully');
        this.updateLoading.set(false);
        this.getAllTasksByUserId();
        this.updateTaskForm.reset();
        this.closeUpdateModel();
      },
      error: (err) => {
        this.toast.error(`Can't Update A Task`);
        this.updateLoading.set(false);
        this.updateTaskForm.reset();
        this.closeUpdateModel();
      },
    });
  }
}
