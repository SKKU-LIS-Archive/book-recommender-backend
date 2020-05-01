import { Request, Response, NextFunction } from "express";

// 외부 패키지 IMPORT
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bookrecommenderml-16a51.firebaseio.com"
});

export const auth = admin.auth();

// 라우터 객체 IMPORT
import router from './routes'

// Express 객체 생성
const app = express();

// [ 미들웨어 등록 - 요청이 들어올 때마다 실행된다. 단순히 서버가 시작되는 것으로는 실행되지 않는다 ]

// body 필드로 받게 되는 데이터를 JSON으로
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

// 정적 파일의 경로를 프로젝트 경로의 public 폴더로 설정
app.use(express.static(path.join(__dirname, "public")));

// CORS 제어 미들웨어 추가
app.use((req: Request, res: Response, next: NextFunction) => {
  // 응답이 가기전에 헤더를 추가한다. 특정 도메인에만 허용을 해줄 수도, 그냥 다 열어버릴 수도 있다.
  res.setHeader("Access-Control-Allow-Origin", "*");

  // 오리진만 열어주면 안되고, 어떤 HTTP 메서드가 허용되는지도 정해줘야 한다.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  // 데이터 요청이나 권한 요청에 관해서만 허용하도록 한다.
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

// 라우터 등록


// DB
export const db = admin.firestore();

//define google cloud function name
// export const webApi = functions.https.onRequest(main);

app.listen(8080, () => {
  console.log("server is now on http://localhost:8080");
});
