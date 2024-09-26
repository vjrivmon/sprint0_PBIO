# Usamos la imagen oficial de Node.js
FROM node:latest

# Crear el directorio de la app
WORKDIR /home/nodejs

# Copiamos el package.json y package-lock.json
COPY package*.json ./
RUN if [ ! -f package.json ]; then npm init -y; fi

# Instalamos las dependencias
RUN npm install mariadb

# Copiamos el resto del código
COPY . .

# Exponemos el puerto 8080
EXPOSE 8080

# Comando para ejecutar tu aplicación
CMD ["node", "main.js"]
