import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '/api/*', // أي API route يخليها server
    renderMode: RenderMode.Server
  },
   {
    path: '**', // أي حاجة تانية تروح لل Angular app
    renderMode: RenderMode.Client
  }
];
