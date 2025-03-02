# Usa una imagen de Node.js oficial
FROM node:22

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Expone el puerto de la API
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "src/server.js"]