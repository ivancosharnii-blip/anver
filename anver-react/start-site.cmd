@echo off
rem ============================================================
rem  Запуск сайта Anver (http://localhost:3111)
rem  Порт 3111: 3000 занят панелью Codent.
rem  Без аргументов — production (сборка + старт).
rem  С аргументом "dev" — режим разработки (без сборки).
rem ============================================================
cd /d "%~dp0"

if /i "%~1"=="dev" goto dev

echo [1/2] Сборка production...
call npm run build
if errorlevel 1 (
  echo Ошибка сборки. Смотри вывод выше.
  pause
  exit /b 1
)

echo [2/2] Запуск на http://localhost:3111 ...
start "" "http://localhost:3111"
call npm run start -- -p 3111
goto end

:dev
echo Запуск dev на http://localhost:3111 ...
call npm run dev -- -p 3111

:end
pause
