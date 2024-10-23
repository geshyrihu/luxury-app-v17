export interface IMenuItem {
  visible: boolean;
  label: string;
  icon?: string;
  routerLink?: string;
  name?: string;
  items?: ISubMenuItem[];
}

export interface ISubMenuItem {
  visible: boolean;
  label: string;
  routerLink?: string;
  name?: string;
}
