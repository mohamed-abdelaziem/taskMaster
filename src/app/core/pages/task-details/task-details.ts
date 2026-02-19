import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../services/task';
import { GlobalLoading } from '../../components/global-loading/global-loading';
import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-task-details',
  imports: [GlobalLoading , DatePipe , ReactiveFormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
  private activedRoute = inject(ActivatedRoute);
  private taskService = inject(Task);
  isLoading = signal<boolean>(false);
  updateableId = signal<number>(0);
  private authService = inject(Auth);
  private toast = inject(ToastrService);
  updateLoading = signal<boolean>(false);
  taskId = signal(0);
  task = signal<ITask|null>(null);

  @ViewChild('updateTaskModal')
  updateTaskModal!: ElementRef;

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.taskId.set(Number(id));
        this.getTask(Number(id));
      }
    });
  }

  getTask(taskId: number) {
    this.isLoading.set(true);
    this.taskService.getSpecificTask(taskId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.task.set(res);
        console.log(res);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }

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
    },
    { validators: [this.validtionOnCreateTaskForm] },
  );

  validtionOnCreateTaskForm(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const due = group.get('dueDate')?.value;

    if (new Date(due) < new Date(start)) {
      group.get('dueDate')?.setErrors(['The Due Date Must Be Valid']);
      return { invalidDateRange: true };
    }

    return null;
  }


   setToUpdate(updateableId: number | undefined, item: any) {
    console.log('set to update');
    this.updateableId.set(updateableId!);
    (this.updateTaskModal.nativeElement as HTMLElement).classList.add('flex');
    (this.updateTaskModal.nativeElement as HTMLElement).classList.remove('hidden');
    this.updateTaskForm.patchValue(item);
  }

  
  closeUpdateModel() {
    (this.updateTaskModal.nativeElement as HTMLElement).classList.remove('flex');
    (this.updateTaskModal.nativeElement as HTMLElement).classList.add('hidden');
  };

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
        this.getTask(this.taskId());
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
 deleteTask(taskId: number | undefined) {
    this.taskId.set(taskId!);
    this.taskService.deleteTask(taskId!).subscribe({
      next: (res) => {
        this.toast.success('Task Deleted Successfully');
        this.taskService.getAllTasks(this.authService.userId());
        this.task.set(null);
      },
      error: (err) => {
        this.toast.error(`Can't Delete This Task Please Try Later Again!`);
      },
    });
  }
}
