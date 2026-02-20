import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from '../environments/environment.development';

export const serverRoutes: ServerRoute[] = [
 
   {
    path: '**', // أي حاجة تانية تروح لل Angular app
    renderMode: RenderMode.Server,
  }
];
