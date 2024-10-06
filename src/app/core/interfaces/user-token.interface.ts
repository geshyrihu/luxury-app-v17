export interface IUserToken {
  token: string;
  expiration: string;
  roles: string[];
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
