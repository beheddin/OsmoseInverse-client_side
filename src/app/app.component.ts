import { Component } from '@angular/core';

import { TopnavComponent } from './Components/topnav/topnav.component';
import { SidenavComponent } from './Components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopnavComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
