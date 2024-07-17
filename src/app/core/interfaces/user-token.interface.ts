export interface IUserToken {
  token: string;
  expiration: string;
  roles: string[];
  infoUserAuthDto: InfoAccountAuthDto;
  // infoEmployeeDto?: IInfoEmployeeAuth;
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

// export interface IInfoEmployeeAuth {
//   employeeId: number | null;
//   firstName: string;
//   lastName: string;
//   birth: string;
//   photoPath: string;
//   fullName: string;
//   profession: string;
//   customer: string;
//   professionId: number;
//   customerId: number;
// }
