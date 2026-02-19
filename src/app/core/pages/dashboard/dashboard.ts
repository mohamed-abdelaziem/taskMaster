import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { DashboardService } from '../../services/dashboard';
import { GlobalLoading } from "../../components/global-loading/global-loading";

@Component({
  selector: 'app-dashboard',
  imports: [GlobalLoading],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
private dashboardService = inject(DashboardService);
private authService =inject(Auth);
dashboardStats = signal<any>(null);
dashboardLoading = signal<boolean>(false);

ngOnInit(): void {
  this.getDashboardDetails(this.authService.userId())
}



getDashboardDetails(userId:number){
  this.dashboardLoading.set(true);
this.dashboardService.getDashboardDetails(userId).subscribe({
next:(res)=>{
console.log(res);
this.dashboardLoading.set(false);
this.dashboardStats.set(res);
},
error:(err)=>{
console.log(err);
this.dashboardLoading.set(false);
}
})

}



}
