# 介绍
本仓库是使用NodeJS编写的一款基于TinyPng的图片压缩工具，指定根目录，会自动检索根目录以及根目录以下的所有PNG,JPG图片，并完成压缩，压缩完成后，会自动覆盖掉原来的文件。
# 使用

前置条件：电脑安装了nodejs,没有安装可以搜索nodejs进行下载。

```
git clone https://github.com/vlinr/compress_image.git

cd compress_image

修改config.js中的目录也可以不修改，并且在该目录中新建config.js中的dir名称的目录/文件夹，新建完成后，将文件拷贝到新建的这个目录下面即可（注意：可以包含文件夹和非图片文件）

node index 

然后输入申请的key回车即可完成自动压缩。

```


