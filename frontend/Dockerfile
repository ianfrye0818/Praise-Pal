# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:1.25.0-alpine

# Copy built files from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




