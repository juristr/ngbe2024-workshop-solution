import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';

console.log('test!!');

@Component({
  standalone: true,
  imports: [RouterOutlet, AppShellComponent],
  selector: 'ens-root',
  template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `,
})
export class AppComponent {
  title = 'movies';
}
