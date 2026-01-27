# Portón Web - Frontend Next.js

Frontend web completo en Next.js con TypeScript que replica la funcionalidad de la app Android.

## Tecnología

- Next.js 14 (App Router)
- React + TypeScript
- Zustand (estado global)
- Tailwind CSS

## Características

- ✅ Login con email y contraseña
- ✅ Botones de acceso rápido (Admin, Usuario, Invitado)
- ✅ Dashboard con botón para abrir portón
- ✅ Campo para Device ID configurable
- ✅ Persistencia de sesión (localStorage)
- ✅ Manejo de estados (cargando, éxito, error)
- ✅ Bloqueo temporal después de abrir (10 segundos)
- ✅ UI moderna y responsive

## Desarrollo Local

```bash
cd source/web
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://porton-api-production.up.railway.app
```

## Deploy en Railway

1. Crea un servicio en Railway apuntando a `source/web`
2. Configura la variable `NEXT_PUBLIC_API_URL`
3. Railway detectará automáticamente Next.js y lo construirá

## Estructura

```
source/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Página principal (ruteo)
│   │   └── globals.css       # Estilos globales
│   ├── components/
│   │   ├── LoginScreen.tsx   # Pantalla de login
│   │   └── DashboardScreen.tsx # Pantalla de dashboard
│   ├── lib/
│   │   └── api.ts            # Cliente API
│   └── stores/
│       └── auth.ts            # Store de autenticación (Zustand)
├── package.json
├── next.config.js
├── tailwind.config.ts
└── railway.toml
```

## Funcionalidades

### Login
- Validación de email y contraseña
- Botones de acceso rápido para pruebas
- Manejo de errores de autenticación
- Persistencia de sesión

### Dashboard
- Campo para Device ID (por defecto: `porton-001`)
- Botón para abrir el portón
- Indicadores de estado (cargando, éxito, error)
- Bloqueo temporal después de abrir (10 segundos)
- Logout que limpia la sesión

## Credenciales de Prueba

- Admin: `admin@porton.com` / `CHANGE_ME_PASSWORD`
- Usuario: `user@porton.com` / `user123`
- Invitado: `guest@porton.com` / `guest123`

## Más Información

- [Arquitectura del Proyecto](../ARQUITECTURA.md)
- [Configuración Railway](./railway.toml)
