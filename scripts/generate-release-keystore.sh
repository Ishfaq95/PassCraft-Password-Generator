#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
KEYSTORE_PATH="$ANDROID_DIR/app/securepass-upload.keystore"
PROPERTIES_PATH="$ANDROID_DIR/keystore.properties"
BACKUP_PATH="$ANDROID_DIR/KEYSTORE_BACKUP.local.txt"
ALIAS="securepass"

if [[ -f "$KEYSTORE_PATH" ]]; then
  echo "Release keystore already exists at:"
  echo "  $KEYSTORE_PATH"
  echo "Remove it first if you want to regenerate."
  exit 1
fi

STORE_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)"

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$STORE_PASSWORD" \
  -keypass "$STORE_PASSWORD" \
  -dname "CN=SecurePass, OU=Mobile, O=SecurePass, L=Unknown, ST=Unknown, C=US"

cat > "$PROPERTIES_PATH" <<EOF
# Release signing — DO NOT COMMIT
STORE_FILE=securepass-upload.keystore
STORE_PASSWORD=$STORE_PASSWORD
KEY_ALIAS=$ALIAS
KEY_PASSWORD=$STORE_PASSWORD
EOF

FINGERPRINT="$(keytool -list -v -keystore "$KEYSTORE_PATH" -storepass "$STORE_PASSWORD" -alias "$ALIAS" 2>/dev/null | awk -F': ' '/SHA256:/{print $2; exit}')"

cat > "$BACKUP_PATH" <<EOF
SecurePass — Release Keystore Backup (LOCAL ONLY — DO NOT COMMIT)
Generated: $(date -u +%Y-%m-%d)

Keystore file:
  android/app/securepass-upload.keystore

Alias:
  $ALIAS

Store password:
  $STORE_PASSWORD

Key password (PKCS12 — same as store password):
  $STORE_PASSWORD

Certificate (SHA-256):
  $FINGERPRINT

IMPORTANT:
- Store this file and the .keystore in a password manager or secure vault.
- If you lose the keystore or passwords, you cannot publish app updates to Play Store.
EOF

echo "Release keystore created:"
echo "  $KEYSTORE_PATH"
echo "Gradle config written:"
echo "  $PROPERTIES_PATH"
echo "Credential backup:"
echo "  $BACKUP_PATH"
echo ""
echo "Back up the keystore and passwords, then delete KEYSTORE_BACKUP.local.txt if desired."
