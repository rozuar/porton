# Control Portón - HTML Standalone

Interfaz web simple y standalone para abrir el portón. Similar a la app Android pero en formato web.

## Tecnología

- HTML5 + CSS3 + JavaScript vanilla
- Sin dependencias externas
- Todo en un solo archivo HTML

## Características

- ✅ Login con email y contraseña
- ✅ Control de portón con Device ID configurable
- ✅ Persistencia de sesión (localStorage)
- ✅ UI moderna y responsive
- ✅ Sin dependencias externas (todo en un solo archivo HTML)

## Desarrollo Local

### Opción 1: Servidor HTTP simple

```bash
cd source/web
python3 -m http.server 8080
# Accede a: http://localhost:8080/porton.html
```

### Opción 2: Con serve

```bash
cd source/web
npx serve -s . -l 3000
# Accede a: http://localhost:3000/porton.html
```

### Opción 3: Abrir directamente

Abre `source/web/porton.html` en el navegador (puede haber problemas de CORS).

## Deploy en Railway

1. Crea un servicio en Railway apuntando a `source/web`
2. Railway usará `serve` para servir los archivos estáticos
3. No se requieren variables de entorno

## Estructura

```
source/web/
├── porton.html              # Control Portón (HTML standalone)
├── access.html              # Control directo NodeMCU (legacy)
├── README.md                # Este archivo
├── README-PORTON.html.md    # Documentación detallada del HTML
├── package.json             # Solo para serve en Railway
└── railway.toml            # Configuración Railway
```

## Configuración de API

El HTML detecta automáticamente la URL de la API:
- **Desarrollo**: `http://localhost:3000` (si estás en localhost)
- **Producción**: `https://porton-api-production.up.railway.app`

Para personalizar, agrega un meta tag en el HTML:
```html
<meta name="api-url" content="https://tu-api.com" />
```

## Acceso

- **URL**: `/porton.html`
- **Requisitos**: Usuario con permisos para el dispositivo
- **Credenciales**: Cualquier usuario del sistema

## Credenciales de Prueba

- Admin: `admin@porton.com` / `CHANGE_ME_PASSWORD`
- Usuario: `user@porton.com` / `user123`
- Invitado: `guest@porton.com` / `guest123`

## Más Información

Ver [README-PORTON.html.md](./README-PORTON.html.md) para documentación detallada.
