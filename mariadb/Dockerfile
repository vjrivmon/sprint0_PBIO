# Usamos la imagen oficial de MariaDB
FROM mariadb:latest

# Definir la variable de entorno para la contraseña de root de MariaDB
ENV MARIADB_ROOT_PASSWORD=1234

# Copiar los archivos SQL para inicializar la base de datos
COPY ./sql/*.sql /docker-entrypoint-initdb.d/
