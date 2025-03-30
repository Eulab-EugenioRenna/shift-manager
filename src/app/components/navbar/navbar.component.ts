import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, SidebarModule, MenuModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  displayMobileMenu = false;
  items: MenuItem[] = [];

  constructor() {
    this.items = [
      {
        label: 'Profilo',
        icon: 'pi pi-user',
        routerLink: '/profilo'
      },
      {
        label: 'Preferenze',
        icon: 'pi pi-cog',
        routerLink: '/preferenze'
      },
      {
        separator: true
      },
      {
        label: 'Amministrazione',
        icon: 'pi pi-shield',
        routerLink: '/admin'
      }
    ];
  }
}
