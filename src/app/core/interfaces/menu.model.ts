export interface MenuItem {
  visible: boolean;
  label: string;
  icon?: string;
  routerLink?: string;
  name?: string;
  badge?: any;
  items?: SubMenuItem[];
}

export interface SubMenuItem {
  visible: boolean;
  label: string;
  routerLink?: string;
  name?: string;
  items?: SubMenuItems[];
}

export interface SubMenuItems {
  visible: boolean;
  label: string;
  routerLink: string;
  name: string;
  parentId?: number;
}
