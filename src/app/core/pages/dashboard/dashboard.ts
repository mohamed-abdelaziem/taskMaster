import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { DashboardService } from '../../services/dashboard';
import { GlobalLoading } from "../../components/global-loading/global-loading";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [GlobalLoading , DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
private dashboardService = inject(DashboardService);
private authService =inject(Auth);
dashboardData = signal<any>(null);
dashboardLoading = signal<boolean>(false);
recentActivity : any[]= [];
ngOnInit(): void {
  this.getDashboardDetails(this.authService.userId());
  this.getRecentActivity(this.authService.userId());
}



getDashboardDetails(userId:number){
  this.dashboardLoading.set(true);
this.dashboardService.getDashboardDetails(userId).subscribe({
next:(res)=>{
console.log(res);
this.dashboardLoading.set(false);
this.dashboardData.set(res);
},
error:(err)=>{
console.log(err);
this.dashboardLoading.set(false);
}
})
};



getRecentActivity(userId:number){
this.dashboardService.getRecentActivity(userId).subscribe({
next:(res)=>{
this.recentActivity = res!;
},
error:(err)=>{
console.log(err);
}
})
}



}
