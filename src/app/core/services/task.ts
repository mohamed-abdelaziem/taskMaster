import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ITask } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class Task {
private http = inject(HttpClient);
private authService = inject(Auth);


getAllTasks(userId:number):Observable<ITask[]>{
return this.http.get<ITask[]>(`${environment.baseUrl}/getAllTasks?userId=${userId}`);
}

createTask(obj:any){
return this.http.post(`${environment.baseUrl}/createTask`,obj);
}

updateTask(taskId:number , obj:any){
return this.http.put(`${environment.baseUrl}/updateTask/${taskId}`,obj);
}

deleteTask(taskId:number){
return this.http.delete(`${environment.baseUrl}/deleteTask/${taskId}`);
}



getSpecificTask(taskId:number):Observable<ITask>{
return this.http.get<ITask>(`${environment.baseUrl}/getTask/${taskId}`);
}


  

}
