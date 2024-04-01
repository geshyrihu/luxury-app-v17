import { IMenuPanelItems } from './menu-pane-iItems.interface';

export interface IMenuPanel {
  group: string;
  items: IMenuPanelItems[];
}
