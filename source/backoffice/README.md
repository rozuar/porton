# Backoffice - Administración Portón

Panel de administración completo para gestionar usuarios, dispositivos, permisos y ver logs del sistema.

## Tecnología

- Next.js 14 (App Router)
- React + TypeScript
- Zustand (estado global)

## Características

- ✅ Gestión de usuarios (crear, listar)
- ✅ Gestión de dispositivos
- ✅ Gestión de permisos (asignar permisos a usuarios)
- ✅ Visualización de logs
- ✅ Autenticación JWT
- ✅ Control de acceso por roles (solo admin)

## Desarrollo Local

```bash
cd source/backoffice
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://porton-api-production.up.railway.app
```

## Deploy en Railway

1. Crea un servicio en Railway apuntando a `source/backoffice`
2. Configura la variable `NEXT_PUBLIC_API_URL`
3. Railway detectará automáticamente Next.js y lo construirá

## Estructura

```
source/backoffice/
├── src/
│   ├── app/
│   │   ├── dashboard/      # Panel de administración
│   │   │   ├── users/      # Gestión de usuarios
│   │   │   ├── devices/    # Gestión de dispositivos
│   │   │   ├── permissions/# Gestión de permisos
│   │   │   └── logs/       # Visualización de logs
│   │   └── login/          # Login del backoffice
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y API client
│   └── stores/             # Estado global (Zustand)
├── package.json
├── next.config.js
└── railway.toml
```

## Acceso

- **URL**: `/` (raíz) o `/login`
- **Requisitos**: Rol de administrador
- **Credenciales por defecto**: `admin@porton.com` / `CHANGE_ME_PASSWORD`

## Rutas

- `/` → Redirige a `/login` o `/dashboard`
- `/login` → Login del backoffice
- `/dashboard` → Dashboard principal
- `/dashboard/users` → Gestión de usuarios
- `/dashboard/devices` → Gestión de dispositivos
- `/dashboard/permissions` → Gestión de permisos
- `/dashboard/logs` → Visualización de logs
