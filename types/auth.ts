import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  vendorId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  iat: number;
  exp: number;
}
