# Travel Blog

Este es un blog de viajes personal creado como proyecto para la materia Diseño y Desarrollo Web.

## Contenido

- Página principal con enlaces (linktree)
- Blog con artículos sobre destinos turísticos
- Sección Identikit

## Configuración para GitHub Pages

Para que este sitio funcione correctamente en GitHub Pages:

1. Sube todo el contenido al repositorio principal
2. Ve a Settings > Pages
3. En "Source", selecciona la rama principal (main)
4. Guarda la configuración y espera unos minutos para que se publique

La URL del sitio será: https://[tu-usuario].github.io/[nombre-repositorio]/

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
