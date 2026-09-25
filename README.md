# 🐮 牛來跳一跳 (Niulai Jump)

> 微信經典小遊戲「跳一跳」3D 復刻版 —— 主角由超人氣魔性黃牛角色「牛來」領銜主演！

---

## 🎮 遊戲簡介

本專案使用 **Three.js** 打造，深度還原了微信「跳一跳」的核心力學手感與視覺設計，並以純 3D 幾何與材質高度還原了「牛來」經典黃牛玩偶造型：

- **高度還原的 3D 牛來造型**：
  - 芥末黃微胖圓滾軀幹 + 呆萌肚腩
  - 靈魂「厭世死魚眼」+ 微挑黑粗眉，傲慢挑釁的魔性神態
  - 向前突出的淡粉肉紫大厚嘴吻部（Muzzle）與雙鼻孔
  - 灰黑微翹牛角、下垂牛耳、分趾牛蹄手腳與小牛尾巴
- **原汁原味跳一跳手感**：
  - 按住蓄力（小牛擠壓下蹲 Squash & Stretch，Web Audio 音頻升調反饋）
  - 鬆手彈射起跳，空中 360 度前空翻拋物線迴旋
  - 完美中心著陸觸發 **PERFECT** 連擊彩蛋（+2, +4, +6...）與白色衝擊波環
  - 踩空跌落虛空，滑稽摔倒結算
- **豐富多樣化方塊**：
  - 經典粉紅禮盒方塊（十字緞帶）
  - 灰色白點方塊
  - 白色可愛貓咪表情方塊
  - 綠色圓台、木箱、金磚方塊

---

## 📱 Android 原生 APK 下載

專案已封裝為原生 Android APK（Capacitor 離線 WebView 架構，零外部依賴，安裝後斷網可玩）：

- 📥 **[點擊下載最新版 APK (v1.0.0)](https://github.com/agooxo-puss/niulai-jump/releases/download/v1.0.0/niulai-jump.apk)**
- **套件名稱**：`com.whypuss.niulaijump`
- **檔案大小**：`3.8 MB`
- **相容性**：適配 Android 8.0+ 及現代 Android 旗艦機（如 Vivo X200 Pro 等）

---

## 🌐 網頁版本地運行

1. 直接開啟根目錄下的 `index.html`：
   ```bash
   open index.html
   ```
2. 或啟動本地 HTTP 服務：
   ```bash
   ./start.sh
   # 訪問 http://localhost:8765 或手機訪問 http://<局域網IP>:8765
   ```

---

## 📦 3D 模型資產

專案內建獨立二進制 3D 模型檔案，可直接拖入 Blender、Godot、Unity 等引擎：
- `niulai_cow.glb`（228.1 KB）
- 網頁端亦支援一鍵點擊「導出 .GLB」下載最新模型。

---

## 🛠️ 技術棧

- **3D 引擎**：Three.js (r128)
- **音效系統**：Web Audio API 原生程序化音頻合成
- **模型格式**：glTF 2.0 Binary (`.glb`)
- **行動封裝**：Capacitor Android 原生 WebView
