#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔨 Generando APK Release para Portón..."
echo ""

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
./gradlew clean

# Generar APK release
echo "📦 Generando APK Release..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    
    if [ -f "$APK_PATH" ]; then
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        VERSION_NAME=$(grep "versionName" app/build.gradle | sed 's/.*versionName "\(.*\)".*/\1/')
        VERSION_CODE=$(grep "versionCode" app/build.gradle | sed 's/.*versionCode \([0-9]*\).*/\1/')
        
        echo ""
        echo "✅ APK generado exitosamente!"
        echo "📦 Archivo: $APK_PATH"
        echo "📏 Tamaño: $APK_SIZE"
        echo "🏷️  Versión: $VERSION_NAME (Code: $VERSION_CODE)"
        echo ""
        
        # Crear carpeta de distribución
        DIST_DIR="../../dist"
        mkdir -p "$DIST_DIR"
        
        # Copiar APK con nombre descriptivo
        DIST_APK="$DIST_DIR/porton-v${VERSION_NAME}-${VERSION_CODE}.apk"
        cp "$APK_PATH" "$DIST_APK"
        
        echo "📋 Copiado a: $DIST_APK"
        echo ""
        
        # Generar hash para verificación
        echo "🔐 Generando hash SHA-256..."
        SHA256=$(sha256sum "$APK_PATH" | cut -d' ' -f1)
        echo "SHA-256: $SHA256"
        echo "$SHA256" > "$DIST_DIR/porton-v${VERSION_NAME}-${VERSION_CODE}.sha256"
        echo "💾 Hash guardado en: $DIST_DIR/porton-v${VERSION_NAME}-${VERSION_CODE}.sha256"
        echo ""
        
        echo "🎉 ¡Listo para distribuir!"
        echo ""
        echo "📱 Instrucciones para instalar:"
        echo "   1. Habilitar 'Fuentes desconocidas' en Android"
        echo "   2. Descargar el APK"
        echo "   3. Abrir el archivo e instalar"
        echo ""
        echo "📄 Ver guía completa en: DISTRIBUCION.md"
        
    else
        echo "❌ Error: APK no encontrado en $APK_PATH"
        exit 1
    fi
else
    echo "❌ Error al generar APK"
    exit 1
fi
