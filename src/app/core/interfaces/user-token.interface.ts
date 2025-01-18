export interface IUserToken {
  token: string;
  expiration: string;
  roles: string[];
  permission: PermissionListDto[];
  customerAccess: SelectItemCustomerAccessDto[];
  infoUserAuthDto: InfoAccountAuthDto;
}

export interface InfoAccountAuthDto {
  customerId: number;
  applicationUserId: string;
  customer: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoPath: string;
  fullName: string;
}
export interface PermissionListDto {
  id: string;
  moduleAppId: string;
  moduleName: string;
  applicationUserId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
export enum EPermission {
  CanCreate = 'canCreate',
  CanRead = 'canRead',
  CanUpdate = 'canUpdate',
  CanDelete = 'canDelete',
}
export interface SelectItemCustomerAccessDto {
  label: string;
  value: number;
  image: string;
}
