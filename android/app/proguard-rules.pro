# Add project specific ProGuard rules here.
# https://developer.android.com/guide/developing/tools/proguard.html

-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**

# Reanimated / Gesture Handler / Screens
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# MMKV / Nitro modules
-keep class com.margelo.nitro.** { *; }

# Keychain
-keep class com.oblador.keychain.** { *; }

# Share
-keep class cl.json.** { *; }

# Blob util
-keep class com.ReactNativeBlobUtil.** { *; }

# Vector icons
-keep class com.oblador.vectoricons.** { *; }

# Haptics
-keep class com.mkuczugazek.** { *; }
