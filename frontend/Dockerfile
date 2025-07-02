# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Remove default nginx html folder contents
RUN rm -rf /usr/share/nginx/html/*

# Copy ONLY the build output (for normal production)
COPY --from=build /app/dist /usr/share/nginx/html


# Copy custom nginx config (overwrites default)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 85

CMD ["nginx", "-g", "daemon off;"]
