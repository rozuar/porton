## App movil: acceso y boton de apertura

### Acceso
- Puede acceder cualquier usuario registrado.
- La app usa login con email/contrasena y obtiene un token JWT.

### Comportamiento del boton "Abrir"
- Al enviar el comando de apertura, el boton pasa a estado **activo** (verde).
- El estado activo termina cuando ocurre **una** de estas condiciones:
  - Se recibe el evento de **porton cerrado** desde el backend/MQTT.
  - Pasan **10 segundos** sin recibir evento (timeout de seguridad).

### Bloqueo de multiples comandos
- Mientras el boton este **activo**, la app **no** debe enviar nuevos comandos.
- Se re-habilita el envio solo cuando se cumple una de las condiciones de cierre o timeout.

### Resultado esperado
- El usuario ve un feedback inmediato (boton verde).
- El sistema evita dobles aperturas hasta que se confirme cierre o expire el timeout.
## App movil: acceso y boton de apertura

### Acceso
- Puede acceder cualquier usuario registrado.
- La app usa login con email/contrasena y obtiene un token JWT.

### Comportamiento del boton "Abrir"
- Al enviar el comando de apertura, el boton pasa a estado **activo** (verde).
- El estado activo termina cuando ocurre **una** de estas condiciones:
  - Se recibe el evento de **porton cerrado** desde el backend/MQTT.
  - Pasan **10 segundos** sin recibir evento (timeout de seguridad).

### Bloqueo de multiples comandos
- Mientras el boton este **activo**, la app **no** debe enviar nuevos comandos.
- Se re-habilita el envio solo cuando se cumple una de las condiciones de cierre o timeout.

### Resultado esperado
- El usuario ve un feedback inmediato (boton verde).
- El sistema evita dobles aperturas hasta que se confirme cierre o expire el timeout.
