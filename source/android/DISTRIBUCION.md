# Distribución Directa de la App Android (Sin Play Store)

Guía para generar un APK y distribuirlo directamente a tus vecinos sin usar Google Play Store.

## Opción 1: Generar APK Release (Recomendado)

### Requisitos
- Android Studio instalado
- Java JDK 17 o superior

### Pasos

#### 1. Abrir el Proyecto
```bash
cd source/android
# Abre Android Studio y selecciona esta carpeta
```

#### 2. Configurar la Firma (Primera Vez)

1. En Android Studio: **Build → Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Si no tienes un keystore, crea uno:
   - **Key store path**: Crea uno nuevo (ej: `porton-release.jks`)
   - **Password**: Guarda esta contraseña de forma segura
   - **Key alias**: `porton-key`
   - **Validity**: 25 años (mínimo recomendado)
   - **Certificate**: Completa tus datos

⚠️ **IMPORTANTE**: Guarda el keystore y la contraseña de forma segura. Si los pierdes, no podrás actualizar la app.

#### 3. Generar APK Release

**Desde Android Studio:**
1. **Build → Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Selecciona tu keystore
4. Selecciona **release** build variant
5. Click **Finish**

El APK se generará en: `app/build/outputs/apk/release/app-release.apk`

**Desde Línea de Comandos:**
```bash
cd source/android

# Generar APK release (sin firmar)
./gradlew assembleRelease

# O generar APK firmado (requiere keystore configurado)
./gradlew assembleRelease
```

El APK estará en: `app/build/outputs/apk/release/`

## Opción 2: APK Debug (Solo para Pruebas)

Si solo quieres probar rápidamente sin firmar:

```bash
cd source/android
./gradlew assembleDebug
```

El APK estará en: `app/build/outputs/apk/debug/app-debug.apk`

⚠️ **Nota**: Los APK debug tienen limitaciones y no son recomendados para distribución final.

## Distribución del APK

### Método 1: Compartir por WhatsApp/Email

1. Genera el APK release
2. Comparte el archivo `app-release.apk` por:
   - WhatsApp
   - Email
   - Google Drive
   - Dropbox
   - Cualquier servicio de almacenamiento en la nube

### Método 2: Crear un Link de Descarga

1. Sube el APK a un servicio de hosting:
   - GitHub Releases
   - Google Drive (compartir link)
   - Dropbox (link público)
   - Tu propio servidor web

2. Comparte el link con tus vecinos

### Método 3: QR Code

1. Sube el APK a un servicio de hosting
2. Genera un QR code con el link
3. Comparte el QR code (impreso o digital)

## Instrucciones para tus Vecinos

### Antes de Instalar

Los usuarios deben habilitar "Fuentes desconocidas" en su Android:

1. **Android 8.0+ (Oreo)**:
   - Ve a **Configuración → Aplicaciones → Acceso especial → Instalar aplicaciones desconocidas**
   - Selecciona el navegador o app que usarás para descargar
   - Activa **"Permitir de esta fuente"**

2. **Android 7.0 y anteriores**:
   - Ve a **Configuración → Seguridad**
   - Activa **"Fuentes desconocidas"**

### Instalación

1. Descarga el archivo APK
2. Abre el archivo descargado
3. Si aparece una advertencia de seguridad, haz clic en **"Instalar de todas formas"** o **"Más opciones → Instalar de todas formas"**
4. Espera a que termine la instalación
5. Abre la app "Portón"

## Configuración del APK

### Verificar URL de la API

Antes de generar el APK, verifica que la URL de la API esté correcta en `app/build.gradle`:

```gradle
buildConfigField "String", "API_BASE_URL", "\"https://porton-api-production.up.railway.app\""
```

### Incrementar Versión

Cada vez que generes un nuevo APK, incrementa la versión:

```gradle
versionCode 2  // Incrementa este número
versionName "1.1"  // Incrementa esta versión
```

## Automatización con Script

Puedes crear un script para automatizar la generación:

### Script: `build-apk.sh`

```bash
#!/bin/bash
cd source/android

echo "🔨 Generando APK Release..."
./gradlew clean assembleRelease

if [ $? -eq 0 ]; then
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        echo "✅ APK generado exitosamente: $APK_PATH"
        echo "📦 Tamaño: $(du -h "$APK_PATH" | cut -f1)"
        
        # Opcional: copiar a una carpeta de distribución
        mkdir -p ../../dist
        cp "$APK_PATH" "../../dist/porton-v$(grep versionName app/build.gradle | cut -d'"' -f2).apk"
        echo "📋 Copiado a: ../../dist/"
    else
        echo "❌ Error: APK no encontrado"
        exit 1
    fi
else
    echo "❌ Error al generar APK"
    exit 1
fi
```

Uso:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

## Actualizaciones

### Para Actualizar la App

1. Incrementa `versionCode` y `versionName` en `build.gradle`
2. Genera un nuevo APK release
3. Distribuye el nuevo APK
4. Los usuarios deben desinstalar la versión anterior e instalar la nueva

### Nota sobre Actualizaciones Automáticas

Sin Play Store, **no hay actualizaciones automáticas**. Los usuarios deben:
- Descargar manualmente el nuevo APK
- Desinstalar la versión anterior
- Instalar la nueva versión

## Alternativa: Firebase App Distribution

Si quieres una solución más profesional (gratis):

1. Crea un proyecto en Firebase
2. Configura Firebase App Distribution
3. Sube el APK a Firebase
4. Invita a tus vecinos por email
5. Ellos recibirán un link para descargar e instalar

## Seguridad

### Verificación de APK

Los usuarios pueden verificar el APK antes de instalar:
- Usa `apksigner` para verificar la firma
- O comparte el hash SHA-256 del APK para verificación

### Generar Hash del APK

```bash
# SHA-256
sha256sum app-release.apk

# MD5
md5sum app-release.apk
```

Comparte este hash con tus vecinos para que verifiquen la integridad.

## Troubleshooting

### "App no instalada"
- Verifica que "Fuentes desconocidas" esté habilitado
- Verifica que haya suficiente espacio
- Desinstala versiones anteriores primero

### "APK corrupto"
- Regenera el APK
- Verifica que la descarga se completó correctamente
- Verifica el hash del APK

### "Error al instalar"
- Verifica que el dispositivo sea compatible (minSdk 24 = Android 7.0+)
- Verifica permisos de almacenamiento

## Más Información

- [Android Developer - Build APK](https://developer.android.com/studio/run)
- [Android Developer - Sign APK](https://developer.android.com/studio/publish/app-signing)
