FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.25.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




