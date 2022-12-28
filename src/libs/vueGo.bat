@echo off
:menu
echo 1.启动当前vue项目
echo.
echo 2.vue编译并推送到test环境
echo.
echo 3.vue编译并推送到pre环境
echo.
echo 4.vue编译并推送到produce环境
echo.
echo 5.将编译文件推送到test环境
echo.
echo 6.将编译文件推送到pre环境
echo.
echo 7.将编译文件推送到produce环境
echo.
echo 8.初始化项目
echo.
echo 9.退出
echo.
set all= 选择相应数字进入功能
set /p all=请输入（1，2，3，4，5，6，7，8，9）
if /i "%all%"=="1" yarn run serve
if /i "%all%"=="2" yarn run build & node ./node/toTest & pause
if /i "%all%"=="3" yarn run build & node ./node/toPre & pause
if /i "%all%"=="4" yarn run build & node ./node/toProduce & pause
if /i "%all%"=="5" node ./node/toTest & pause
if /i "%all%"=="6" node ./node/toPre & pause
if /i "%all%"=="7" node ./node/toProduce & pause
if /i "%all%"=="8" yarn
if /i "%all%"=="9" exit
:hide

:show
goto menu
:exit
exit