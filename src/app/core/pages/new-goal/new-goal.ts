import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { GoalService } from '../../services/goal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-goal',
  imports: [ReactiveFormsModule],
  templateUrl: './new-goal.html',
  styleUrl: './new-goal.css',
})
export class NewGoal {
  createGoalLoading = signal<boolean>(false);
  private authService = inject(Auth);
  private goalService = inject(GoalService);
  private toast = inject(ToastrService);
  router = inject(Router);

  createGoalForm = new FormGroup(
    {
      goalId: new FormControl(0),
      goalName: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      isAchieved: new FormControl(false),
      userId: new FormControl(this.authService.userId()),
      milestones: new FormArray([]),
    },
    { validators: [this.validtionOnCreateGoalForm] },
  );

  validtionOnCreateGoalForm(group: AbstractControl) {
    const startDate = group?.get('startDate')?.value;
    const endDate = group?.get('endDate')?.value;

    if (new Date(endDate) < new Date(startDate)) {
      group.get('endDate')?.setErrors(['The End Date Must Be In Future']);
      return { invalid: true };
    }

    return null;
  }

  get milestones() {
    return this.createGoalForm.get('milestones') as FormArray;
  }

  addMilestone() {
    const milestone = new FormGroup({
      milestoneId: new FormControl(0),
      milestoneName: new FormControl(''),
      description: new FormControl(''),
      targetDate: new FormControl(''),
      isCompleted: new FormControl(false),
    });

    this.milestones.push(milestone);
  }

  removeMilestone(index: number) {
    this.milestones.removeAt(index);
  }

  createGoal() {
    if (this.createGoalForm.invalid) {
      console.log('invalid');
      this.createGoalForm.markAllAsTouched();
      return;
    }

    this.createGoalLoading.set(true);
    console.log(this.createGoalForm.value)

    this.goalService.createGoalWithMileStones(this.createGoalForm.value).subscribe({
      next: (res) => {
        this.toast.success(`The Goal Created Successfully`);
        this.createGoalForm.reset();
        this.createGoalLoading.set(false);
        this.router.navigateByUrl('/dashboard/goals')
      },
      error: (err) => {
        this.toast.error(`Can't Create The Goal`);
        this.createGoalForm.reset();
        this.createGoalLoading.set(false);
      },
    });
  }
}
