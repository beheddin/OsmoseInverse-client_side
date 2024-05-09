//the model class binds data to the form
export class Register {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public cin: string,
    public password: string
  ) {}
}
