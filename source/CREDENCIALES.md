# Credenciales del Sistema

Este documento lista todas las credenciales por defecto del sistema.

## Usuarios del Sistema

### Administrador
- **Email**: `admin@porton.com`
- **Contraseña**: `CHANGE_ME_PASSWORD`
- **Rol**: `admin`
- **Acceso**: Backoffice completo + Control portón

### Usuario Regular
- **Email**: `user@porton.com`
- **Contraseña**: `user123`
- **Rol**: `user`
- **Acceso**: Solo control portón

### Invitado
- **Email**: `guest@porton.com`
- **Contraseña**: `guest123`
- **Rol**: `guest`
- **Acceso**: Solo control portón

### Usuarios de Prueba (Bulk)
- **Emails**: `user1@porton.com` hasta `user10@porton.com`
- **Contraseña**: `user123` (todos)
- **Rol**: `user`
- **Acceso**: Solo control portón

## Ubicación de las Credenciales

### 1. Base de Datos (Seed)
**Archivo**: `source/api/src/seeds/seed.ts`

Las credenciales se crean cuando se ejecuta el seed:
```typescript
const adminPasswordHash = await bcrypt.hash('CHANGE_ME_PASSWORD', 10);
// ...
'admin@porton.com'
```

### 2. Frontend Web (Next.js)
**Archivo**: `source/web/src/components/LoginScreen.tsx`

```typescript
const quickProfiles = [
  { label: 'Admin', email: 'admin@porton.com', password: 'CHANGE_ME_PASSWORD' },
  // ...
];
```

### 3. Backoffice (Next.js)
**Archivo**: `source/backoffice/src/app/login/page.tsx`

```typescript
const testProfiles = [
  { label: 'Admin', email: 'admin@porton.com', password: 'CHANGE_ME_PASSWORD' },
  // ...
];
```

### 4. App Android
**Archivo**: `source/android/app/src/main/java/com/porton/app/MainActivity.kt`

```kotlin
val quickProfiles = listOf(
  "Admin" to "admin@porton.com",
  // ...
)
val quickPassword = "CHANGE_ME_PASSWORD"
```

### 5. Scripts de Provisionamiento
**Archivo**: `scripts/provision-nodemcu.sh`

```bash
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@porton.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-CHANGE_ME_PASSWORD}"
```

## ⚠️ IMPORTANTE: Cambiar Contraseña en Producción

La contraseña `CHANGE_ME_PASSWORD` es un **placeholder** y debe cambiarse en producción.

### Cómo Cambiar la Contraseña del Admin

#### Opción 1: Desde el Backoffice
1. Inicia sesión como admin
2. Ve a `/dashboard/users`
3. Busca `admin@porton.com`
4. Edita y cambia la contraseña (si hay funcionalidad de edición)

#### Opción 2: Desde la Base de Datos
```sql
-- Conectar a PostgreSQL y ejecutar:
UPDATE users 
SET "passwordHash" = '$2b$10$NUEVO_HASH_AQUI' 
WHERE email = 'admin@porton.com';
```

Para generar el hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TU_NUEVA_PASSWORD', 10).then(console.log)"
```

#### Opción 3: Modificar el Seed
1. Edita `source/api/src/seeds/seed.ts`
2. Cambia `'CHANGE_ME_PASSWORD'` por tu nueva contraseña
3. Ejecuta el seed nuevamente (solo creará si no existe)

## Verificación de Credenciales

Para verificar que las credenciales funcionan:

### Desde el Frontend Web
1. Accede a `https://porton-web.railway.app`
2. Haz clic en el botón "Admin"
3. Deberías iniciar sesión automáticamente

### Desde el Backoffice
1. Accede a `https://porton-backoffice.railway.app/login`
2. Haz clic en el botón "Admin"
3. Deberías ver el dashboard

### Desde la API (cURL)
```bash
curl -X POST https://porton-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@porton.com","password":"CHANGE_ME_PASSWORD"}'
```

## Seguridad

### Recomendaciones
1. ✅ **Cambiar `CHANGE_ME_PASSWORD`** en producción
2. ✅ Usar contraseñas fuertes (mínimo 12 caracteres)
3. ✅ No commitear contraseñas reales en el código
4. ✅ Usar variables de entorno para contraseñas en producción
5. ✅ Rotar contraseñas periódicamente

### Variables de Entorno Recomendadas
En producción, considera usar variables de entorno:
```env
ADMIN_EMAIL=admin@porton.com
ADMIN_PASSWORD=tu_contraseña_segura_aqui
```

Y modificar el seed para leerlas:
```typescript
const adminPassword = process.env.ADMIN_PASSWORD || 'CHANGE_ME_PASSWORD';
```

## Más Información

- [Seed Script](../api/src/seeds/seed.ts)
- [Documentación de Seguridad](../docs/credential-rotation-checklist.md)
