@echo off
:menu
echo 1.������ǰvue��Ŀ
echo.
echo 2.vue���벢���͵�test����
echo.
echo 3.vue���벢���͵�pre����
echo.
echo 4.vue���벢���͵�produce����
echo.
echo 5.�������ļ����͵�test����
echo.
echo 6.�������ļ����͵�pre����
echo.
echo 7.�������ļ����͵�produce����
echo.
echo 8.��ʼ����Ŀ
echo.
echo 9.�˳�
echo.
set all= ѡ����Ӧ���ֽ��빦��
set /p all=�����루1��2��3��4��5��6��7��8��9��
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