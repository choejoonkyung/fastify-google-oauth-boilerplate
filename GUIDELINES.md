## Running on your machine

이 프로젝트는 mariadb, aws s3, google oauth를 사용합니다.

### Docker로 mariadb 실행하기

docker/mariadb로 이동한 뒤 아래를 순서대로 입력합니다. (\*docker-compose 설치 필요)

```
docker-compose up -d
docker exec -it [dockerid] bash
myslq -u root -p

create database fastify;

grant all privileges on fastify.* TO 'fastify'@'%' identified by 'FASTIFYCANDY!';

flush privileges;
```

### 환경변수 설정

루트 디렉토리에 .env 파일을 생성합니다. 프로젝트에 필요하지만 유출 위험성이 있는 정보는 환경 변수로 설정해야 합니다. 아래와 같이 입력합니다.

```
DATABASE_URL='mysql:/root:FASTIFYCANDY!@localhost:3306/fastify'
FASTIFY_PORT=8080
JWT_SECRET_KEY=FASTIFYCANDY!
BUCKET_NAME=[AWS S3의 BUCKET_NAME]
REGION=ap-[AWS S3의 REGION]
```

### 빌드

프로젝트를 시작하기 위해 루트 디렉토리에서 다음 명령어를 실행합니다.

#### 의존 패키지 설치

```
npm install
```

#### 개발 모드

```
npm run dev
```

#### 프로젝트 시작

```
npm start
```
