export interface IMenuPanel {
  group: string;
  // icon: string;
  items: IMenuPanelItems[];
}
export interface IMenuPanelItems {
  title: string;
  path: string;
}
