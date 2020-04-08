import { Platform } from "react-native"
import fs from 'react-native-fs'

/* 文件存储目录 */
const baseFile = Platform.OS === "ios" ? fs.ExternalStorageDirectoryPath + "/qzspMove" : fs.MainBundlePath + "/qzspMove";
fs.exists(baseFile).then(exists => {
    if (!exists) {
        fs.mkdir(baseFile)
    }
})

class DownloadManager {
    /**
   * 正在进行中的任务
   *  {
   *    maxProgress: 100,
        progress: 0,
        status:0, // 0 运行中 -1 失败 2成功
        toFile:toFile,
   *  }
   */
    allRunningTask = new Map()
    listeners = new Set();

    async startDownloadM3U8(data) {

        //根据url获取到对应的本地目录
        let url = data.url;
        let urlSplits = url.split("/");
        let protocolDomain = `${urlSplits[0]}//${urlSplits[2]}`;

        let path = urlSplits.slice(3, urlSplits.length - 1).join("/");
        let fileName = urlSplits[urlSplits.length - 1];

        let toDirPath = baseFile + "/" + path;    //本地存储路径
        await fs.mkdir(toDirPath)
        let toFile = toDirPath + "/" + fileName;  //本地存储文件地址

        /* 这里的东西 暂时没有用到 */
        data.maxProgress = 100;
        data.progress = 0;
        data.status = 0;
        data.toFile = toFile;
        data.file = toFile;
        //添加m3u8下载任务到缓存
        //this.allRunningTask.set(data.id, data)

        //开始下载m3u8文件
        let task = fs.downloadFile({
            fromUrl: url,
            toFile: toFile,

            begin: function (res) {
            },
            progress: function (res) {
            },
        });



        let result = await task.promise
        if (result.statusCode == 200) {
            console.log('index.m3u8下载成功', toFile, url, result)
            try {
                //m3u8下载成功,开始逐步下载ts文件
                await this.readM3U8File(data, url, toFile, toDirPath, protocolDomain, path)
                console.log('netlog-', '所有ts文件都下载成功了')
                //标记下载成功

            } catch (error) {

            }
        } else {

        }

    }

    /**
     * 读取m3u8对应的内容，获取到对应的ts文件地址
     * @param {*} data : 网络获取的的数据源
     * @param {*} m3u8Url  视频网络路径
     * @param {*} m3u8LocalFile  本地存储文件地址
     * @param {*} m3u8LocalDir   本地存储路径
     * @param {*} protocolDomain  协议加域名
     * @param {*} path  “20200324/xttejfbh/10000kb/hls/”
     */
    async readM3U8File(data, m3u8Url, m3u8LocalFile, m3u8LocalDir, protocolDomain, path) {
        let result = await fs.readFile(m3u8LocalFile)
        let lines = result.split('\n');

        let tsUrls = [];
        for (let line of lines) {
            if (line.endsWith('.jpg') || line.indexOf("jpg") > -1) {
                tsUrls.push(line)
            }
        }
        //开始下载key
        await this.startDownloadKey(protocolDomain + path, m3u8LocalDir)
        //设置最大进度，默认为ts文件数为单位
        //this.allRunningTask.get(data.id).maxProgress = tsUrls.length;
        //开始下载ts文件
        await this.startDownloadTS(data, m3u8Url, tsUrls, 0, m3u8LocalDir, protocolDomain);
    }
    /**
    * 开始下载key文件
    * @param {*} url  网络获取的的数据源
    * @param {*} toDir 
 
    */
    async startDownloadKey(url, toDir) {
        //开始下载key文件
        let task = fs.downloadFile({
            fromUrl: url + "key.key",
            toFile: toDir + "key.key",

            begin: function (res) {
            },
            progress: function (res) {
            },
        });
        return task.promise
    }

    /**
     * 开始下载ts文件
     * @param {*} data  网络获取的的数据源
     * @param {*} m3u8Url  视频网络路径
     * @param {*} tsUrls   ts/jpg 数据集合
     * @param {*} index    下载的JPG 下标
     * @param {*} m3u8Dir   本地存储路径
     */
    async startDownloadTS(data, m3u8Url, tsUrls, index, m3u8LocalDir, protocolDomain) {
        /* 所有的jpg下载完成 */
        if (index >= tsUrls.length) {
            return;
        };

        let url = tsUrls[index];
        //如果ts文件中包含域名 则说明为片头广告 暂时不下载
        if (url.indexOf(protocolDomain) > -1) {
            await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8LocalDir, protocolDomain)
        }

        let downloadUrl = protocolDomain + url;  //网络地址
        let tsName = url.slice(url.lastIndexOf("/") + 1);
        let toFile = m3u8LocalDir + "/" + tsName; //本地地址
        let result = await this.createDownloadTSPromise(downloadUrl, toFile)


        if (result.statusCode == 200) {
            console.log('jpg下载成功了', toFile, downloadUrl, result)
            //刷新进度
            //this.allRunningTask.get(data.id).progress = index + 1;
            //通知出去
            //this._updatelisteners()
            await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8LocalDir, protocolDomain)
        }


    }

    /**
     * 创建ts下载任务
     * @param {*} url 
     * @param {*} file 
     */
    createDownloadTSPromise(url, file) {
        let task = fs.downloadFile({
            fromUrl: url,
            toFile: file,
            // connectionTimeout: 1000 * 60,
            // readTimeout: 1000 * 60,
            begin: function (res) {
            },
            progress: function (res) {
            },
        });
        return task.promise
    }


}


