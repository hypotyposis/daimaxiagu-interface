export interface IJudgerResult {
  language: string;
  message: string;
  status:
    | 'Accepted'
    | 'Compile Error'
    | 'Runtime Error'
    | 'Network Error'
    | 'Pending';
  cin: string;
  code: string;
}
