@echo off
echo ====================================
echo AI ScreenSaver - Автоматическая сборка
echo ====================================
echo.

echo Сборка веб-версии...
call npm run build:web
if %errorlevel% neq 0 (
    echo Ошибка при сборке веб-версии
    pause
    exit /b 1
)
echo ✅ Веб-версия готова!
echo.

echo Сборка Android версии...
call npm run build:android
if %errorlevel% neq 0 (
    echo Ошибка при сборке Android версии
    pause
    exit /b 1
)
echo ✅ Android экспорт готов!
echo.

echo Проверка Java для создания APK...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Java не найдена. Для создания APK установите Java JDK 17+
    echo Скачать: https://adoptium.net/
    echo.
    echo Сборки готовы в папке dist/
    pause
    exit /b 0
)

echo Создание APK файла...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo ⚠️  Ошибка при создании APK. Проверьте настройки Android SDK
    cd ..
    echo.
    echo Экспорты готовы в папке dist/
    pause
    exit /b 0
)
cd ..

echo.
echo ====================================
echo ✅ Все сборки готовы!
echo ====================================
echo 📁 Веб-версия: dist/
echo 📁 Android экспорт: dist/
echo 📱 APK файл: android/app/build/outputs/apk/release/app-release.apk
echo.
pause
