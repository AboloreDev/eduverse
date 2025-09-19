export interface CreateAccount {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface Login {
  email: string;
  password: string;
}
