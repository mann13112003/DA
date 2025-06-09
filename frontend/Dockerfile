FROM node:18 AS build
WORKDIR /app
ARG VITE_API_URL
ARG API_PREDICTION
ENV VITE_API_URL=$VITE_API_URL
ENV API_PREDICTION=$API_PREDICTION
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# COPY file cấu hình nginx mới
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
