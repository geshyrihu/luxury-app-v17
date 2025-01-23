export interface IMenuItem {
  group?: string;
  isTitle?: boolean;
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
