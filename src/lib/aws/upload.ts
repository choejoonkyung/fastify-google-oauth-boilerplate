import fs from "fs";
import AWS from "aws-sdk";

const { BUCKET_NAME, REGION } = process.env;

const s3 = new AWS.S3({
  apiVersion: "2006-03-1",
  region: REGION,
});

export default function uplaod(fileDir: string, targetDir: string) {
  if (!BUCKET_NAME) throw new Error("BUCKET_NAME이 존재하지 않습니다.");

  return new Promise((res, rej) => {
    const fileStream = fs.createReadStream(fileDir);
    fileStream.on("error", (err) => {
      return rej(err);
    });
    s3.upload(
      {
        Bucket: BUCKET_NAME,
        Key: targetDir,
      },
      (err, data) => {
        if (err) return rej(err);
        res(data);
      }
    );
  });
}
