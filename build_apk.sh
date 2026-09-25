#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="/tmp/niulai-jump-build"
TEMPLATE_DIR="/Users/whypuss/.kimaki/projects/n5-app/n5-app-apk"
BUILD_TOOLS="/Users/whypuss/Library/Android/sdk/build-tools/37.0.0"
KEYSTORE="/tmp/niulaijump.keystore"
KS_PASS="pass:whypuss123"
OUT_APK="$DIR/niulai-jump.apk"

export JAVA_HOME=/opt/homebrew/opt/openjdk
export PATH=$JAVA_HOME/bin:$PATH

echo "=== 開始構建「牛來跳一跳」Android APK ==="

# 1. 清理並複製模板
rm -rf "$WORK_DIR"
mkdir -p "$WORK_DIR"
echo "正在從模板複製 APK 結構..."
cp -R "$TEMPLATE_DIR/" "$WORK_DIR/"

# 2. 清理 assets/public 並注入牛來跳一跳遊戲全套資源
echo "正在注入牛來跳一跳遊戲資源與 3D 模型..."
rm -rf "$WORK_DIR/assets/public"
mkdir -p "$WORK_DIR/assets/public/vendor"

cp "$DIR/index.html" "$WORK_DIR/assets/public/index.html"
cp "$DIR/niulai_cow.glb" "$WORK_DIR/assets/public/niulai_cow.glb"
cp "$DIR/vendor/three.min.js" "$WORK_DIR/assets/public/vendor/three.min.js"
cp "$DIR/vendor/GLTFExporter.js" "$WORK_DIR/assets/public/vendor/GLTFExporter.js"

# 3. 更新 capacitor.config.json
cat << 'EOF' > "$WORK_DIR/assets/capacitor.config.json"
{
  "appId": "com.whypuss.niulaijump",
  "appName": "牛來跳一跳",
  "webDir": "public"
}
EOF

# 4. 更新 strings.xml（App 名稱與識別碼）
echo "更新應用名稱與文字配置..."
cat << 'EOF' > "$WORK_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="abc_action_bar_home_description">Navigate home</string>
    <string name="abc_action_bar_up_description">Navigate up</string>
    <string name="abc_action_menu_overflow_description">More options</string>
    <string name="abc_action_mode_done">Done</string>
    <string name="abc_activity_chooser_view_see_all">See all</string>
    <string name="abc_activitychooserview_choose_application">Choose an app</string>
    <string name="abc_capital_off">OFF</string>
    <string name="abc_capital_on">ON</string>
    <string name="abc_menu_alt_shortcut_label">Alt+</string>
    <string name="abc_menu_ctrl_shortcut_label">Ctrl+</string>
    <string name="abc_menu_delete_shortcut_label">delete</string>
    <string name="abc_menu_enter_shortcut_label">enter</string>
    <string name="abc_menu_function_shortcut_label">Function+</string>
    <string name="abc_menu_meta_shortcut_label">Meta+</string>
    <string name="abc_menu_shift_shortcut_label">Shift+</string>
    <string name="abc_menu_space_shortcut_label">space</string>
    <string name="abc_menu_sym_shortcut_label">Sym+</string>
    <string name="abc_prepend_shortcut_label">Menu+</string>
    <string name="abc_search_hint">Search…</string>
    <string name="abc_searchview_description_clear">Clear query</string>
    <string name="abc_searchview_description_query">Search query</string>
    <string name="abc_searchview_description_search">Search</string>
    <string name="abc_searchview_description_submit">Submit query</string>
    <string name="abc_searchview_description_voice">Voice search</string>
    <string name="abc_shareactionprovider_share_with">Share with</string>
    <string name="abc_shareactionprovider_share_with_application">Share with %s</string>
    <string name="abc_toolbar_collapse_description">Collapse</string>
    <string name="androidx_startup">androidx.startup</string>
    <string name="app_name">牛來跳一跳</string>
    <string name="custom_url_scheme">com.whypuss.niulaijump</string>
    <string name="no_webview_text">This app requires a WebView to work</string>
    <string name="package_name">com.whypuss.niulaijump</string>
    <string name="search_menu_title">Search</string>
    <string name="status_bar_notification_info_overflow">999+</string>
    <string name="title_activity_main">牛來跳一跳</string>
</resources>
EOF

# 5. 更新 AndroidManifest.xml
echo "更新 Android 清單配置..."
cat << 'EOF' > "$WORK_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.whypuss.niulaijump">
    <uses-permission android:name="android.permission.INTERNET"/>
    <permission android:name="com.whypuss.niulaijump.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" android:protectionLevel="signature"/>
    <uses-permission android:name="com.whypuss.niulaijump.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"/>
    <application android:allowBackup="true" android:appComponentFactory="androidx.core.app.CoreComponentFactory" android:debuggable="false" android:extractNativeLibs="false" android:icon="@mipmap/ic_launcher" android:label="@string/app_name" android:roundIcon="@mipmap/ic_launcher_round" android:supportsRtl="true" android:theme="@style/AppTheme">
        <activity android:configChanges="locale|keyboard|keyboardHidden|navigation|orientation|screenLayout|uiMode|screenSize|smallestScreenSize|density" android:exported="true" android:label="@string/title_activity_main" android:launchMode="singleTask" android:name="com.whypuss.n5web.MainActivity" android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <provider android:authorities="com.whypuss.niulaijump.fileprovider" android:exported="false" android:grantUriPermissions="true" android:name="androidx.core.content.FileProvider">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/file_paths"/>
        </provider>
        <provider android:authorities="com.whypuss.niulaijump.androidx-startup" android:exported="false" android:name="androidx.startup.InitializationProvider">
            <meta-data android:name="androidx.emoji2.text.EmojiCompatInitializer" android:value="androidx.startup"/>
            <meta-data android:name="androidx.lifecycle.ProcessLifecycleInitializer" android:value="androidx.startup"/>
            <meta-data android:name="androidx.profileinstaller.ProfileInstallerInitializer" android:value="androidx.startup"/>
        </provider>
        <receiver android:directBootAware="false" android:enabled="true" android:exported="true" android:name="androidx.profileinstaller.ProfileInstallReceiver" android:permission="android.permission.DUMP">
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SKIP_FILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.SAVE_PROFILE"/>
            </intent-filter>
            <intent-filter>
                <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION"/>
            </intent-filter>
        </receiver>
    </application>
</manifest>
EOF

# 6. 使用 apktool 編譯未簽名 APK
echo "使用 apktool 進行字節碼打包..."
rm -rf "$WORK_DIR/build"
/opt/homebrew/bin/apktool b "$WORK_DIR" -o "/tmp/niulai-jump-unaligned.apk"

# 7. 生成簽名密鑰（若無）
if [ ! -f "$KEYSTORE" ]; then
    echo "生成專屬簽名 Keystore..."
    keytool -genkeypair -v \
        -keystore "$KEYSTORE" \
        -alias niulai \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass whypuss123 \
        -keypass whypuss123 \
        -dname "CN=whypuss, OU=Game, O=NiulaiJump, L=Macau, ST=Macau, C=MO"
fi

# 8. zipalign 對齊
echo "執行 zipalign 對齊..."
rm -f "/tmp/niulai-jump-aligned.apk"
"$BUILD_TOOLS/zipalign" -p -f 4 "/tmp/niulai-jump-unaligned.apk" "/tmp/niulai-jump-aligned.apk"

# 9. apksigner 官方 v2/v3 簽名
echo "使用 apksigner 簽名..."
"$BUILD_TOOLS/apksigner" sign \
    --ks "$KEYSTORE" \
    --ks-pass "$KS_PASS" \
    --key-pass "$KS_PASS" \
    --ks-key-alias niulai \
    --out "$OUT_APK" \
    "/tmp/niulai-jump-aligned.apk"

# 10. 驗證簽名
echo "驗證 APK 簽名狀態..."
"$BUILD_TOOLS/apksigner" verify --verbose "$OUT_APK"

# 11. 清理臨時檔案
rm -rf "$WORK_DIR" /tmp/niulai-jump-unaligned.apk /tmp/niulai-jump-aligned.apk

echo "=== 構建完成！ ==="
echo "APK 檔案: $OUT_APK"
echo "檔案大小: $(ls -lh "$OUT_APK" | awk '{print $5}')"
