FROM node:18-alpine

WORKDIR /app

# Corepack 활성화 및 Yarn 버전 설정
RUN corepack enable \
    && corepack prepare yarn@4.5.1 --activate

# 패키지 파일 복사
COPY package.json yarn.lock ./

# 소스 코드 복사
COPY . .

# 의존성 설치
RUN yarn install

# 빌드
RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]