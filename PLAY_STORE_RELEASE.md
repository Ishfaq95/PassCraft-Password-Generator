# SecurePass — Google Play Store Release Checklist

Use this checklist before every Play Store upload.

**Package:** `com.securepass`  
**Current version:** `1.0.0` (versionCode `1`)

---

## 1. Pre-build

- [ ] Bump `versionCode` in `android/app/build.gradle` (required for every upload)
- [ ] Bump `versionName` in `android/app/build.gradle`
- [ ] Align `package.json` and `src/assets/branding/brand.ts` versions
- [ ] Run quality checks:
  ```bash
  npm run typecheck
  npm test -- --watchman=false
  npm run lint
  ```
- [ ] Test on a physical Android device (ARM)
- [ ] Verify app lock, export, history, favorites, and theme switching
- [ ] Confirm privacy policy URL is live: `https://securepass.app/privacy`

---

## 2. Signing (first release only)

- [ ] Generate upload keystore:
  ```bash
  keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore android/app/securepass-upload.keystore \
    -alias securepass \
    -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Copy `android/keystore.properties.example` → `android/keystore.properties`
- [ ] Fill in keystore path and passwords (never commit these files)
- [ ] Back up keystore and passwords in a secure vault (loss = cannot update app)

---

## 3. Build release AAB

```bash
npm run android:clean
npm run android:bundle
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Optional APK (sideload / QA)

```bash
npm run android:release
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

---

## 4. Release build configuration (already configured)

| Setting            | Value                                  |
| ------------------ | -------------------------------------- |
| Hermes             | Enabled                                |
| New Architecture   | Enabled                                |
| R8 / ProGuard      | Enabled                                |
| Resource shrinking | Enabled                                |
| ABIs               | `armeabi-v7a`, `arm64-v8a`             |
| `allowBackup`      | `false`                                |
| Console logs       | Stripped in production builds          |
| Adaptive icon      | `mipmap-anydpi-v26/ic_launcher.xml`    |
| Splash             | Native + Android 12 API + JS bootstrap |

---

## 5. Play Console — Store listing

- [ ] App name: **SecurePass**
- [ ] Short description (80 chars max)
- [ ] Full description
- [ ] App icon: 512×512 PNG (high-res icon)
- [ ] Feature graphic: 1024×500 PNG
- [ ] Phone screenshots (min 2, recommend 4–8)
- [ ] Category: Tools or Productivity
- [ ] Contact email
- [ ] Privacy policy URL

---

## 6. Play Console — Policy & compliance

- [ ] **Data safety** form completed
  - Passwords stored locally on device (MMKV)
  - PIN hash stored in Android Keystore
  - No data collected or transmitted to backend
  - Export/share uses system share sheet only
- [ ] **Content rating** questionnaire completed
- [ ] **Target audience** declared
- [ ] **Ads** declaration: No ads
- [ ] Declare if app is designed for children (typically No)

---

## 7. Play Console — Release

- [ ] Upload `app-release.aab` to Internal testing first
- [ ] Install and smoke-test from Play internal track
- [ ] Promote to Closed testing → Open testing → Production
- [ ] Add release notes
- [ ] Roll out (staged rollout recommended: 10% → 50% → 100%)

---

## 8. Post-release

- [ ] Monitor Android vitals (crashes, ANRs)
- [ ] Respond to user reviews
- [ ] Tag release in version control
- [ ] Archive mapping file if needed: `android/app/build/outputs/mapping/release/mapping.txt`

---

## Troubleshooting

| Issue                               | Fix                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| Release build uses debug signing    | Create `android/keystore.properties`                                               |
| Emulator build fails (x86)          | Run with `--active-arch-only` or add x86 to `reactNativeArchitectures` temporarily |
| ProGuard crash on release           | Check `android/app/proguard-rules.pro`, test release build on device               |
| Native module missing after release | Rebuild: `npm run android:clean && npm run android:bundle`                         |

---

## Version bump reference

```gradle
// android/app/build.gradle
versionCode 2        // increment by 1 each upload
versionName "1.0.1"  // user-visible semver
```

```json
// package.json
"version": "1.0.1"
```

```typescript
// src/assets/branding/brand.ts
version: '1.0.1',
```
