import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

const { BUCKET_NAME, REGION } = process.env;

if (!BUCKET_NAME || !REGION)
  throw new Error("환경변수에 버킷이름이 없거나 리전이 없습니다.");

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: BUCKET_NAME },
  region: REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: "public-read",
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, "images/" + Date.now().toString() + extension);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

export default upload;
