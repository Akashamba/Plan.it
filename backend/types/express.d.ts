declare global {
  namespace Express {
    interface Request {
      userId: string;
      validatedQuery?: any;
      validatedBody?: any;
    }
  }
}

export {};
