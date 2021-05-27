import AWS from "aws-sdk";

const { BUCKET_NAME, REGION } = process.env;

const s3 = new AWS.S3({ apiVersion: "2006-03-01", region: REGION });

export default function upload(
  file: NodeJS.ReadableStream,
  mimetype: string,
  targetDir: string
) {
  if (!BUCKET_NAME) {
    throw new Error("BUCKET_NAME Environment Variable not set");
  }

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: BUCKET_NAME,
        Key: targetDir,
        ContentType: mimetype,
        Body: file,
      },
      (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
      }
    );
  });
}
