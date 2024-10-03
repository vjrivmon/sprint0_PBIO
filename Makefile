# regla en azul
# variable en verde
# valor de variable en rojo

nodecito_img:
# ejemplo, cambiar por nuestras variables
	docker build --tag nodecito_img --file Dockerfile.nodecito .


# detras de los 2 puntos dice de que depende
help:
	@echo
	@echo 