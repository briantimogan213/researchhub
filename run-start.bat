@echo off
npm run build
echo Web: http://localhost:8000
php -S localhost:8000 index.php