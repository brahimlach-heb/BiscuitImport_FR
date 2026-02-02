# =========================
# Stage 1 : Build React/Vite
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=http://72.62.237.60:3000
RUN npm run build

# =========================
# Stage 2 : Serve production
# =========================
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
