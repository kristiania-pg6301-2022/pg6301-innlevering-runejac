declare namespace Express {
  // for å definere res.cookie type i quizApi.ts
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}
