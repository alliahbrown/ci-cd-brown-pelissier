FROM node:20-alpine

WORKDIR /app

# copier les fichiers de dépendances
COPY package*.json ./

# installer toutes les dépendances
RUN npm ci

# copier le code source
COPY . .

# compiler le projet
RUN npm run build

# rendre le cli exécutable
RUN chmod +x dist/cli.js

# définir le point d'entrée
ENTRYPOINT ["node", "dist/cli.js"]

# affichage de l'aide
CMD ["--help"]