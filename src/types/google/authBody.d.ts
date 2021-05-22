export default interface GoogleAuthBody {
  access_token: string;
  username: string;
  [k: string]: unknown;
}
