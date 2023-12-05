class UsernameTakenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsernameTakenError";
  }
}

class EmailTakenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailTakenError";
  }
}

export { UsernameTakenError, EmailTakenError };
