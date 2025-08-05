# Инструкции по сборке AI ScreenSaver

## Проект успешно создан и готов к сборке!

### ✅ Веб-версия (готова)

Веб-версия уже собрана и находится в папке `dist/`:

```bash
npx expo export --platform web
```

Результат:
- **Папка**: `dist/`
- **Размер**: 6 статических маршрутов, основной бандл 1.66 MB
- **Деплой**: Содержимое папки `dist/` можно разместить на любом веб-сервере

### 📱 Android версия

#### Экспорт создан:
```bash
npx expo export --platform android
```

Результат:
- **Папка**: `dist/`
- **Бандл**: Android Hermes Bytecode (3.46 MB)
- **Ресурсы**: 29 файлов ресурсов

#### Для создания APK нужно:

1. **Установить Java Development Kit (JDK)**:
   - Скачать JDK 17 или выше
   - Установить переменную `JAVA_HOME`

2. **Установить Android Studio** (для Android SDK):
   - Скачать с https://developer.android.com/studio
   - Установить Android SDK
   - Настроить переменную `ANDROID_HOME`

3. **Создать APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

#### Альтернативный способ - через Expo Application Services (EAS):

1. **Создать аккаунт Expo**:
   ```bash
   npx expo register
   ```

2. **Войти в аккаунт**:
   ```bash
   npx expo login
   ```

3. **Настроить EAS Build**:
   ```bash
   eas build:configure
   ```

4. **Создать APK в облаке**:
   ```bash
   eas build --platform android
   ```

### 🚀 Функции приложения

- ✅ Цифровые часы с секундами (отдельный блок)
- ✅ Виджет погоды с прогнозом на 5 дней
- ✅ Динамические фоновые изображения
- ✅ Мультиязычность (English/Русский)
- ✅ Настройки температуры (°C/°F)
- ✅ Настройки внешнего вида:
  - Размер шрифта часов и даты
  - Цвет текста
  - Прозрачность
- ✅ Адаптивный дизайн для всех платформ

### 📁 Структура проекта

```
AIScreenSaver/
├── app/                    # Экраны и навигация
├── components/             # Компоненты UI
│   ├── screensaver/       # Основной экран
│   └── settings/          # Настройки
├── services/              # Сервисы (настройки, погода, фон)
├── types/                 # TypeScript типы
├── utils/                 # Утилиты (локализация)
├── dist/                  # Собранные версии (web + android)
└── android/               # Нативный Android проект
```

### 🔧 Разработка

```bash
# Запуск в режиме разработки
npx expo start

# Веб-версия
npx expo start --web

# Android эмулятор
npx expo start --android

# iOS симулятор
npx expo start --ios
```

### 📋 Требования

- Node.js 18+
- Expo CLI
- Для Android: Java JDK 17+, Android SDK
- Для iOS: macOS, Xcode

### 🎯 Готовые сборки

- **Web**: ✅ Готова в папке `dist/`
- **Android**: ⚠️ Требует Java/Android SDK для создания APK
- **iOS**: 🔄 Требует macOS и Xcode

Проект полностью функционален и готов к использованию!
