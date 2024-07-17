import { ChangePasswordInterface } from "../Interfaces/change-password.interface";

export class ChangePasswordFormModel implements ChangePasswordInterface {
  constructor(
    public currentPassword: string,
    public newPassword: string,
    public confirmNewPassword: string
  ) {}
}
