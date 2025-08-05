#!/bin/bash

echo "===================================="
echo "AI ScreenSaver - Автоматическая сборка"
echo "===================================="
echo

echo "Сборка веб-версии..."
npm run build:web
if [ $? -ne 0 ]; then
    echo "Ошибка при сборке веб-версии"
    exit 1
fi
echo "✅ Веб-версия готова!"
echo

echo "Сборка Android версии..."
npm run build:android
if [ $? -ne 0 ]; then
    echo "Ошибка при сборке Android версии"
    exit 1
fi
echo "✅ Android экспорт готов!"
echo

echo "Проверка Java для создания APK..."
if ! command -v java &> /dev/null; then
    echo "⚠️  Java не найдена. Для создания APK установите Java JDK 17+"
    echo "Скачать: https://adoptium.net/"
    echo
    echo "Сборки готовы в папке dist/"
    exit 0
fi

echo "Создание APK файла..."
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo "⚠️  Ошибка при создании APK. Проверьте настройки Android SDK"
    cd ..
    echo
    echo "Экспорты готовы в папке dist/"
    exit 0
fi
cd ..

echo
echo "===================================="
echo "✅ Все сборки готовы!"
echo "===================================="
echo "📁 Веб-версия: dist/"
echo "📁 Android экспорт: dist/"
echo "📱 APK файл: android/app/build/outputs/apk/release/app-release.apk"
echo
