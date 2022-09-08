FROM node:lts-alpine3.14
WORKDIR /app
EXPOSE 8080
COPY . .
RUN npm --registry https://registry.npm.taobao.org install && npm run build
CMD ["npm", "run", "start"]
