export interface IUserToken {
  token: string;
  expiration: string;
  roles: string[];
  infoUserAuthDto: IInfoAccountAuth;
  infoEmployeeDto?: IInfoEmployeeAuth;
}

export interface IInfoAccountAuth {
  applicationUserId: string;
  phone: string;
  email: string;
  professionId: number;
  customerId: number;
  profession: string;
  customer: string;
}

export interface IInfoEmployeeAuth {
  employeeId: number | null;
  personId: number | null;
  firstName: string;
  lastName: string;
  birth: string;
  photoPath: string;
  fullName: string;
  profession: string;
  customer: string;
  professionId: number;
  customerId: number;
}
