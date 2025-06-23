## Contenido

- Página principal con enlaces (linktree)
- Blog con artículos sobre destinos turísticos
- Sección Identikit

## Submódulo identikit2

Este proyecto incluye un submódulo Git para la sección Identikit:

```
[submodule "identikit2"]
	path = identikit2
	url = https://github.com/blassmm/identikit2.git
```

Para clonar este repositorio con el submódulo, usa:

```
git clone --recurse-submodules https://github.com/[tu-usuario]/[nombre-repositorio].git
```

## Notas

- Todas las rutas de archivos son relativas para funcionar correctamente en GitHub Pages
- El archivo index.html es el punto de entrada principal
