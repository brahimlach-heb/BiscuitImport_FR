# =========================
# Stage 1 : Build React/Vite
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Build de l'application
ARG VITE_API_BASE_URL=http://72.62.237.60:3000
RUN npm run build

# =========================
# Stage 2 : Serve production
# =========================
FROM node:18-alpine

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Installer un serveur HTTP simple
RUN npm install -g serve

# Copier les fichiers build depuis le builder
COPY --from=builder /app/dist ./dist

# Définir le port pour servir l'application
EXPOSE 80

# Changer la propriété du dossier pour l'utilisateur non-root
RUN chown -R appuser:appuser /app

# Passer à l'utilisateur non-root
USER appuser

# Vérifier que l'application fonctionne
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Lancer le frontend
CMD ["serve", "-s", "dist", "-l", "80"]
