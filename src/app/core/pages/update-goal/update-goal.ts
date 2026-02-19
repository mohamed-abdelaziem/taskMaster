import { Component, OnInit } from '@angular/core';
import {  inject, signal } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { IGoal } from '../../interfaces/goal.interface';
@Component({
  selector: 'app-update-goal',
  imports: [ReactiveFormsModule],
templateUrl: './update-goal.html',
  styleUrl: './update-goal.css',
})
export class UpdateGoal implements OnInit {
updateGoalLoading = signal<boolean>(false);
  private authService = inject(Auth);
  private goalService = inject(GoalService);
  private toast = inject(ToastrService);
  private activedRoute = inject(ActivatedRoute);
  goalId = signal<any>(undefined);
  goal = signal<any>(null);
  router = inject(Router);
 updateGoalForm = new FormGroup(
    {
      goalId: new FormControl(this.goalId()),
      goalName: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      isAchieved: new FormControl(false),
      userId: new FormControl(this.authService.userId()),
      milestones: new FormArray([]),
    },
    { validators: [this.validtionOnupdateGoalForm] },
  );

  validtionOnupdateGoalForm(group: AbstractControl) {
    const startDate = group?.get('startDate')?.value;
    const endDate = group?.get('endDate')?.value;

    if (new Date(endDate) < new Date(startDate)) {
      group.get('endDate')?.setErrors(['The End Date Must Be In Future']);
      return { invalid: true };
    }

    return null;
  }

  get milestones() {
    return this.updateGoalForm.get('milestones') as FormArray;
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

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe((params)=>{
      const id = params.get('id');
       if(id){
      this.goalId.set(Number(id));
      this.getGoal(Number(id));
       }
    })
  }


  // ngAfterViewInit(): void {
  //   this.updateGoalForm.patchValue(this.goal());
  // }

 





  

  removeMilestone(index: number) {
    this.milestones.removeAt(index);
  }

  updateGoal() {
    
    if (this.updateGoalForm.invalid) {
      console.log('invalid');
      this.updateGoalForm.markAllAsTouched();
      return;
    }
    const obj = {...this.updateGoalForm.value,goalId : this.goalId() , userId : this.authService.userId()}
    this.updateGoalLoading.set(true);
    
    
    this.goalService.updateGoal(this.goalId(),obj).subscribe({
      next: (res) => {
        this.toast.success(`The Goal Updated Successfully`);
        this.updateGoalForm.reset();
        this.updateGoalLoading.set(false);
        this.router.navigateByUrl('/dashboard/goals')
      },
      error: (err) => {
        this.toast.error(`Can't updated The Goal`);
        this.updateGoalForm.reset();
        this.updateGoalLoading.set(false);
      },
    });
  }


  getGoal(goalId:number){
   const res = this.goalService.getGoal(goalId).subscribe({
      next:(res)=>{
        this.goalId.set(res.goalId);
        this.goal.set(res);
        this.updateGoalForm.patchValue(res);
        
      },
      error:(err)=>{
        console.log(err);
      }
    });
    
  }
}
