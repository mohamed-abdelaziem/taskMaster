import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IReminder } from '../interfaces/reminder.interface';

@Injectable({
  providedIn: 'root',
})
export class RemindersService {
  
private http = inject(HttpClient);




createReminder(obj:any){
return this.http.post(`${environment.baseUrl}/createReminder`,obj);
};


// https://api.freeprojectapi.com/api/GoalTracker/getReminders?userId=8275
getAllReminders(userId:number):Observable<IReminder[]>{
return this.http.get<IReminder[]>(`${environment.baseUrl}/getReminders?userId=${userId}`);
}



updateReminder(reminderId:number , obj : any){
return this.http.put(`${environment.baseUrl}/updateReminder/${reminderId}` , obj);
}


deleteReminder(reminderId:number){
return this.http.delete(`${environment.baseUrl}/deleteReminder/${reminderId}`);
}

getReminder(reminderId:number):Observable<IReminder | null>{
return this.http.get<IReminder | null>(`${environment.baseUrl}/getReminder/${reminderId}`);
}






}
