import * as jwt from "jsonwebtoken";
const { JWT_SECRET_KEY } = process.env;

export async function generateToken(
  paylaod: string | object | Buffer,
  options: jwt.SignOptions = {}
) {
  if (!JWT_SECRET_KEY) throw new Error("환경 변수에 시크릿 키가 없습니다.");

  const promise = new Promise((res, rej) => {
    jwt.sign(paylaod, JWT_SECRET_KEY, options, (err, token) => {
      if (err) return rej(err);
      res(token);
    });
  });

  return promise;
}

export async function decodeToken<T>(token: string) {
  if (!JWT_SECRET_KEY) throw new Error("환경 변수에 시크릿 키가 없습니다.");

  const promise = new Promise<T>((res, rej) => {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded) return res(decoded as any);
    return rej("decoded error");
  });

  return promise;
}
