export interface IMenuItem {
  visible: boolean;
  label: string;
  icon?: string;
  routerLink?: string;
  name?: string;
  badge?: any;
  items?: ISubMenuItem[];
}

export interface ISubMenuItem {
  visible: boolean;
  label: string;
  routerLink?: string;
  name?: string;
  items?: ISubMenuItems[];
}

export interface ISubMenuItems {
  visible: boolean;
  label: string;
  routerLink: string;
  name: string;
  parentId?: number;
}
