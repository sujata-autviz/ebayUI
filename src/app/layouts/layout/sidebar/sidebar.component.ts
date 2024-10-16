import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import {  NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from '../../../interfaces/menu-items/menu-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  activatedMenuItems: MenuItem[] = [];
  menuItemsMap: { [key: number]: MenuItem } = {};
  isCollapsed: boolean = false;
  isUniversityAdmin: boolean = false; // Assuming this is from a user role check
  userDetails: any = {};
  innerWidth: any;
  
  constructor(
    private router: Router,
    private _cdr: ChangeDetectorRef,
  ) {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd event:', event);
       // this.handleNavigationEvent(event);
      }
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateActiveMenuItem();
      });
    });
  }

  ngOnInit(): void {
  
  }
  handleNavigationEvent(event: NavigationEnd) {
    if (event.url === '/' && event.urlAfterRedirects === '/') {
      this.router.navigate(['/dashboard']);
    }
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        route: '/dashboard',
        permissionName: '',
        img: '',
        id: 0,
        isActive: false
      },
     
      
    ];
  }
  updateActiveMenuItem() {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.isActive = currentRoute.startsWith(item.route);
      if (item.children) {
        item.children.forEach(child => {
          child.isActive = currentRoute.startsWith(child.route);
        });
      }
    });
  }
  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }


  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems); 
    this.activatedMenuItems = []; 
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems); 
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true; 
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  
  findMenuItemsByUrl(url: string, items: MenuItem[], foundedItems: MenuItem[] = []): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }


  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]); 
    }
    this._cdr.detectChanges();
  }


  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSidebarOnMobileView() {
    if (this.innerWidth <= 991) this.isCollapsed = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 991) this.isCollapsed = true;
    else this.isCollapsed = false;
  }
}

