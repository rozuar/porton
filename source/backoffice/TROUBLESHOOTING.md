# Troubleshooting - Backoffice

## Error: "failing to fetch"

Este error indica que el backoffice no puede conectarse a la API.

### Solución 1: Verificar Variable de Entorno

**En Railway:**
1. Ve al servicio del backoffice
2. Abre la pestaña "Variables"
3. Verifica que exista: `NEXT_PUBLIC_API_URL`
4. El valor debe ser la URL completa de tu API, por ejemplo:
   ```
   https://porton-api-production.up.railway.app
   ```
   **NO incluyas** `/api` al final, el código lo agrega automáticamente.

### Solución 2: Verificar que la API esté corriendo

1. Abre la URL de tu API en el navegador: `https://tu-api.railway.app/api`
2. Deberías ver un error 404 o similar (esto es normal, significa que la API está corriendo)
3. Si no responde, verifica que el servicio de la API esté desplegado

### Solución 3: Verificar CORS

La API debe tener CORS habilitado. Verifica en `source/api/src/main.ts` que tenga:
```typescript
app.enableCors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Solución 4: Verificar en la Consola del Navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca el mensaje de advertencia:
   ```
   ⚠️ NEXT_PUBLIC_API_URL no está configurada. Usando localhost (solo para desarrollo)
   ```
   Si ves esto, significa que la variable no está configurada.

4. Ve a la pestaña "Network"
5. Intenta hacer login
6. Busca la petición fallida y revisa el error

### Solución 5: Re-deploy del Backoffice

Después de configurar la variable de entorno:
1. Ve al servicio del backoffice en Railway
2. Haz clic en "Redeploy"
3. Espera a que termine el deploy
4. Intenta nuevamente

## Verificación Rápida

Ejecuta esto en la consola del navegador (F12) cuando estés en el backoffice:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'NO CONFIGURADA');
```

Si muestra "NO CONFIGURADA", entonces el problema es la variable de entorno.

## Mensajes de Error Mejorados

Ahora el backoffice mostrará mensajes más descriptivos:

- Si no puede conectar: "No se pudo conectar a la API. Verifica que: 1. La variable NEXT_PUBLIC_API_URL esté configurada 2. La API esté corriendo..."
- Si la API responde con error: "Error 401: Unauthorized" o similar
- Si hay problemas de red: Mensaje específico del error de red

## Más Información

- [README Principal](./README.md)
- [Configuración Railway](../RAILWAY-SERVICIOS.md)
