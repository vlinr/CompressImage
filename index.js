/******
 * 
 * 系统版本：1.0.1
 * 系统作者：keen
 * 系统说明：本系统接入tp压缩，key需要自己去官方申请，进入根目录直接node index，然后输入key值即可自动压缩，config为一些配置，
 * 默认输出目录会在CompressImage，安装放入的原样输出，讲需要压缩的图片放到CompressImage目录下，压缩完成后，会自动放回对应目录。
 * 完成时间：2020-05-19
 * E-mail:zlife@vip.qq.com
 * *****/
const tinify = require("tinify"),
    fs = require("fs"),
    readline = require("readline");
Config = require("./config").Config;
class Compress {
    constructor(key, path) {
        console.log('压缩服务已启动~');
        this.source = [];
        this.allnum = 0;
        this.init(key, path);
    }
    //检查数量
    checkNum() {
        return Config.maxComNum - Number(this.compressionCount());
    }
    //获取已用数量
    compressionCount() {
        return tinify.compressionCount;
    }
    //设置秘钥
    init(key, path) {
        console.log('key初始化成功，等待签名认证...');
        tinify.key = key;
        this.validateKey(path);
    }
    //校验
    validateKey(path) {
        tinify.validate(err => {
            if (err) {
                console.log('签名错误，请检查key值或稍后再试~');
                process.exit(0);
            }
            console.log('认证成功,开始校验剩余次数~');
            let checkNumber = this.checkNum();
            if (checkNumber <= 0 || isNaN(checkNumber)) {  //使用次数
                console.log('当前key的剩余可用数已用尽或key值错误，请更换key重试！');
                process.exit(0);
            }
            console.log('剩余压缩次数为：' + checkNumber);
            console.log('计算文件总数,请等待...');
            this.computedFiles(path);
            //计算完毕
            this.compress(checkNumber);
        });
    }
    //计算文件总数
    computedFiles(path) {
        //同步执行
        try {
            let fileList = fs.readdirSync(path);
            fileList.forEach(item => {
                let stat = fs.statSync(path + '/' + item);
                if (stat.isDirectory()) {  //判断是否是目录                
                    this.computedFiles(path + '/' + item);
                } else {
                    this.source.push({
                        path: path + '/' + item,
                        name: item
                    });
                }
            });
        } catch (err) {
            console.log('读取发生错误:' + err);
        }
    }
    //获取文件总数
    getFileNum() {
        this.allnum = this.source.length;
        return this.allnum;
    }
    //开始读取文件并上传
    compress(surplus) {
        let fileNum = this.getFileNum();
        console.log('文件总数为：' + fileNum);
        if(fileNum > surplus){
            console.log('压缩次数剩余不足，建议更换key或减少图数量,文件数：' + fileNum + '-----剩余压缩次数：' + surplus);
            process.exit(0);
        }
        console.log('开始压缩文件，请等待...');
        this.source.map(async item => {
            if (!this.checkFileType(item.name, ['png', 'jpg', 'jpeg'])) {
                console.log('压缩失败,文件类型错误,名称为：' + item.name + '-----剩余：'+this.allnum);
                this.allnum--;
            } else {
                const source = await tinify.fromFile(item.path);  //来自于哪里
                await source.toFile(item.path);  //输出到哪里
                console.log('压缩成功,名称为：' + item.name + '-----剩余：'+this.allnum);
                this.allnum--;
            }
            if (this.allnum == 0) {
                console.log('全部压缩完成！');
                process.exit(0);
            }
        });
    }
    //检查文件类型
    checkFileType(filePath, type) {
        let arr = filePath.split('.');
        if (Array.isArray(type) && type.indexOf(arr[arr.length - 1]) !== -1) return true;
        else if (typeof type == 'string' && type.toLocaleLowerCase() == arr[arr.length - 1].toLocaleLowerCase()) return true;
        return false;
    }
}
//默认CompressImage目录下面的所有资源，如果需要更改目录，可以在此处进行修改，默认输出CompressImage/
console.log('请输入TinyPng Key:')
const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
readLine.on('line', function (line) {
    new Compress(`${line.replace(/\s+/g, '')}`, Config.dir);
});

