import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LAYOUT_HORIZONTAL,
  LAYOUT_MODE,
  LAYOUT_POSITION,
  LAYOUT_VERTICAL,
  LAYOUT_WIDTH,
  SIDEBAR_COLOR,
  SIDEBAR_SIZE,
  TOPBAR,
} from './layouts.model';
import VerticalComponent from './vertical/vertical.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, VerticalComponent],
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {
  // layout related config
  layoutType!: string;
  layoutMode!: string;
  layoutwidth!: string;
  layoutposition!: string;
  topbar!: string;
  sidebarcolor!: string;
  sidebarsize!: string;

  ngOnInit() {
    this.layoutMode = LAYOUT_MODE;
    this.layoutType = LAYOUT_VERTICAL;
    this.layoutwidth = LAYOUT_WIDTH;
    this.layoutposition = LAYOUT_POSITION;
    this.sidebarcolor = SIDEBAR_COLOR;
    this.sidebarsize = SIDEBAR_SIZE;
    this.topbar = TOPBAR;

    this.LayoutMode(this.layoutMode);
    this.LayoutWidth(this.layoutwidth);
    this.LayoutPosition(this.layoutposition);
    this.Topbar(this.topbar);
    this.SidebarColor(this.sidebarcolor);
    this.SidebarSize(this.sidebarsize);

    // listen to event and change the layout, theme, etc
  }

  ngAfterViewInit() {}

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }

  /**
   * Layout Mode Set
   */
  LayoutMode(mode: string) {
    switch (mode) {
      case 'light':
        document.body.setAttribute('data-layout-mode', 'light');
        document.body.setAttribute('data-topbar', 'light');
        document.body.setAttribute('data-sidebar', 'light');
        break;
      case 'dark':
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.setAttribute('data-layout-mode', 'dark');
        document.body.setAttribute('data-topbar', 'dark');
        break;
      default:
        document.body.setAttribute('data-layout-mode', 'light');
        document.body.setAttribute('data-topbar', 'light');
        break;
    }
  }

  /**
   * Layout Width Set
   */
  LayoutWidth(width: string) {
    switch (width) {
      case 'light':
        document.body.setAttribute('data-layout-size', 'fluid');
        break;
      case 'boxed':
        document.body.setAttribute('data-layout-size', 'boxed');
        break;
      default:
        document.body.setAttribute('data-layout-size', 'light');
        break;
    }
  }

  /**
   * Layout Position Set
   */
  LayoutPosition(position: string) {
    if (position === 'fixed') {
      document.body.setAttribute('data-layout-scrollable', 'false');
    } else {
      document.body.setAttribute('data-layout-scrollable', 'true');
    }
  }

  /**
   * Layout Sidebar Color Set
   */
  SidebarColor(color: string) {
    switch (color) {
      case 'light':
        document.body.setAttribute('data-sidebar', 'light');
        break;
      case 'dark':
        document.body.setAttribute('data-sidebar', 'dark');
        break;
      case 'brand':
        document.body.setAttribute('data-sidebar', 'brand');
        break;
      default:
        document.body.setAttribute('data-sidebar', 'light');
        break;
    }
  }

  /**
   * Layout Topbar Set
   */
  Topbar(topbar: string) {
    switch (topbar) {
      case 'light':
        document.body.setAttribute('data-topbar', 'light');
        break;
      case 'dark':
        document.body.setAttribute('data-topbar', 'dark');
        break;
      default:
        document.body.setAttribute('data-topbar', 'light');
        break;
    }
  }

  /**
   * Layout Sidebar Size Set
   */
  SidebarSize(size: string) {
    switch (size) {
      case 'default':
        document.body.setAttribute('data-sidebar-size', 'lg');
        break;
      case 'compact':
        document.body.setAttribute('data-sidebar-size', 'md');
        break;
      case 'small':
        document.body.setAttribute('data-sidebar-size', 'sm');
        break;
      default:
        document.body.setAttribute('data-sidebar-size', 'lg');
        break;
    }
  }
}
