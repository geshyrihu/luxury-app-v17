export interface UserTokenDto {
  token: string;
  expiration: string;
  roles: string[];
  infoUserAuthDto: InfoAccountAuthDto;
  infoEmployeeDto?: InfoEmployeeAuthDto;
}

export interface InfoAccountAuthDto {
  applicationUserId: string;
  phone: string;
  email: string;
  professionId: number;
  customerId: number;
  profession: string;
  customer: string;
}

export interface InfoEmployeeAuthDto {
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
