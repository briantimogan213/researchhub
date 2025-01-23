@echo off
setlocal

:: Define the array of directories and files
set "filesToCopy=index.php .htaccess composer.json composer.lock config public uploads vendor src"

:: Define the destination directory relative to the batch file
set "destDir=%~dp0dist"

:: Create the destination directory if it doesn't exist
if not exist "%destDir%" (
  mkdir "%destDir%"
)

:: Loop through each item in the array
for %%F in (%filesToCopy%) do (
  if exist "%%F" (
    echo Copying %%F to %destDir%
    if exist "%%F\" (
      :: If it's a directory, use xcopy
      xcopy "%%F" "%destDir%\%%~nxF" /E /I /Y >nul
    ) else (
      :: If it's a file, use copy
      copy "%%F" "%destDir%" >nul
    )
  ) else (
    echo %%F does not exist.
  )
)

echo Configure .env.production for deployment:
set "DEFAULT_MYSQL_HOST=localhost"
set "DEFAULT_MYSQL_PORT=3306"
set "DEFAULT_MYSQL_DATABASE=researchhub"
set "DEFAULT_MYSQL_USER=root"
set "DEFAULT_MYSQL_PASSWORD="
set "DEFAULT_URI_PREFIX="

set /p MYSQL_HOST="Enter value for MYSQL_HOST (default: %DEFAULT_MYSQL_HOST%): "
if "%MYSQL_HOST%"=="" set "MYSQL_HOST=%DEFAULT_MYSQL_HOST%"

set /p MYSQL_PORT="Enter value for MYSQL_PORT (default: %DEFAULT_MYSQL_PORT%): "
if "%MYSQL_PORT%"=="" set "MYSQL_PORT=%DEFAULT_MYSQL_PORT%"

set /p MYSQL_DATABASE="Enter value for MYSQL_DATABASE (default: %DEFAULT_MYSQL_DATABASE%): "
if "%MYSQL_DATABASE%"=="" set "MYSQL_DATABASE=%DEFAULT_MYSQL_DATABASE%"

set /p MYSQL_USER="Enter value for MYSQL_USER (default: %DEFAULT_MYSQL_USER%): "
if "%MYSQL_USER%"=="" set "MYSQL_USER=%DEFAULT_MYSQL_USER%"

set /p MYSQL_PASSWORD="Enter value for MYSQL_PASSWORD (default: %DEFAULT_MYSQL_PASSWORD%): "
if "%MYSQL_PASSWORD%"=="" set "MYSQL_PASSWORD=%DEFAULT_MYSQL_PASSWORD%"

set /p URI_PREFIX="Enter value for URI_PREFIX (default: %DEFAULT_URI_PREFIX%): "
if "%URI_PREFIX%"=="" set "URI_PREFIX=%DEFAULT_URI_PREFIX%"

(
  echo MYSQL_HOST=%MYSQL_HOST%
  echo MYSQL_PORT=%MYSQL_PORT%
  echo MYSQL_DATABASE=%MYSQL_DATABASE%
  echo MYSQL_USER=%MYSQL_USER%
  echo MYSQL_PASSWORD=%MYSQL_PASSWORD%
  echo # change the URI_PREFIX to the origin path of the web application ::folder name in xampp inside htdocs folder::
  echo URI_PREFIX=%URI_PREFIX%
) > "%destDir%\.env.production"


echo Done!
endlocal