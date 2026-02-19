import { Component, inject, OnInit, signal } from '@angular/core';
import { GlobalLoading } from "../../components/global-loading/global-loading";
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { GoalService } from '../../services/goal';
import { IGoal } from '../../interfaces/goal.interface';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-goal',
  imports: [GlobalLoading, RouterLink , DatePipe],
  templateUrl: './goal.html',
  styleUrl: './goal.css',
})
export class Goal implements OnInit {
  getGoalsLoading = signal<boolean>(false);
  deleteGoalLoading = signal<boolean>(false);
  private toast = inject(ToastrService);
  private authService = inject(Auth);
  private goalService = inject(GoalService);
  goalList !: IGoal[];

 ngOnInit(): void {
    this.getAllGoalsByUserId();
  }


  getAllGoalsByUserId(){
    this.getGoalsLoading.set(true);
    this.goalService.getAllGoalsByUserId(this.authService.userId()).subscribe({
      next:(res)=>{
        this.getGoalsLoading.set(false);
        this.goalList = res;
        console.log(res);
      },
      error:(err)=>{
        this.getGoalsLoading.set(false);
        console.log(err);
      }
    })
  }


  deleteGoal(goalId:number){
    this.deleteGoalLoading.set(true);
    this.goalService.deleteGoal(goalId).subscribe({
      next:(res)=>{
        this.getAllGoalsByUserId();
        this.deleteGoalLoading.set(false);
        this.toast.success(`The Goal Deleted Successfully`);
        
      },
      error:(err)=>{
        this.getAllGoalsByUserId();
        this.toast.error(`Can't Delete Goal`);
        this.deleteGoalLoading.set(false);
      }
    })


  }

}
