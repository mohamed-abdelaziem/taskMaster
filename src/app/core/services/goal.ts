import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IGoal } from '../interfaces/goal.interface';

@Injectable({
  providedIn: 'root',
})
export class GoalService{
  private http = inject(HttpClient);
  


  createGoalWithMileStones(obj:any){
    return this.http.post(`${environment.baseUrl}/createGoalWithMilestones`,obj);
  }

  getAllGoalsByUserId(userId:number):Observable<IGoal[]>{
    return this.http.get<IGoal[]>(`${environment.baseUrl}/getAllGoalsByUser?userId=${userId}`);
  };

  deleteGoal(goalId:number){
    return this.http.delete(`${environment.baseUrl}/deleteGoal/${goalId}`)
  }
  updateGoal(goalId:number , obj:any){
    return this.http.put(`${environment.baseUrl}/updateGoalWithMilestones/${goalId}`,obj)
  }
  
  getGoal(goalId:number):Observable<any>{
    return this.http.get<any>(`${environment.baseUrl}/getGoal/${goalId}`);
  }


 

}
