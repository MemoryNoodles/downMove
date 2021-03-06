import { Platform, AsyncStorage } from "react-native"
import fs from 'react-native-fs'
import Storage from "./util/storage"
 

/* 文件存储目录 */
const baseFile = Platform.OS === "ios" ? fs.MainBundlePath + "/qzspMove" : fs.DocumentDirectoryPath + "/qzspMove";
fs.exists(baseFile).then(exists => {
    if (!exists) {
        fs.mkdir(baseFile)
    }
})

class DownloadManager {
    /**
   * 正在进行中的任务
   *  {
   *   
        progress: 0,
        status:0, // 0 运行中 -1 失败 2成功
        toFile:toFile,
   *  }
   */
    allRunningTask = {};
    listeners = new Set();
    /* 刷新进度就靠它了 */
    addListener(listener = () => { }) {
        this.listeners.add(listener)
    }

    removeListener(listener = () => { }) {
        if (this.listeners.has(listener)) {
            this.listeners.delete(listener)
        }
    }

    /**
     * 观察者模式，对外发送通知
     */
    _updatelisteners() {
        for (let listener of this.listeners) {
            listener && listener();
        }
    }

    isEmpty(object) {
        if (JSON.stringify(object) === '{}') {
            return false
        }
        return true
    }

    async startDownloadM3U8(data) {
        //目前有下载的视频 直接return
        if (this.isEmpty(this.allRunningTask)) {
            //tipMsg("目前有视频正在下载中！")
            return
        }

        //查询本地已经下载成功的视频
        let videos = await AsyncStorage.getItem(Storage.videoChache);
        videos = videos ? JSON.parse(videos) : [];
       
        let localFile;
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id == data.id) {
                localFile = obj.file;
            }
        }

        if (localFile) {
            //提示已经下载过该视频
        }

        // return 
        //根据url获取到对应的本地目录
        let url = data.url;
        let urlSplits = url.split("/");
        let protocolDomain = `${urlSplits[0]}//${urlSplits[2]}`;

        let path = urlSplits.slice(3, urlSplits.length - 1).join("/");
        let fileName = urlSplits[urlSplits.length - 1];

        let toDirPath = baseFile + "/" + path;    //本地存储路径
        await fs.mkdir(toDirPath)
        let toFile = toDirPath + "/" + fileName;  //本地存储文件地址

        data.progress = 0;
        data.status = 0;
        data.toFile = toFile;
        data.file = toFile;
        data.path = path;
        //添加m3u8下载任务到缓存
        this.allRunningTask = data
        console.log("开始下载m3u8文件")
        //开始下载m3u8文件
        let task = fs.downloadFile({
            fromUrl: url,
            toFile: toFile,
            cacheable: false,
            begin: function (res) {
                console.log(res, "res")
            },
            progress: function (res) {
                console.log(res, "progress")
            },
        });



        let result = await task.promise
        console.log(result,"result")
        if (result.statusCode == 200) {
            console.log('index.m3u8下载成功', toFile, url, result)
            try {
                //m3u8下载成功,开始逐步下载ts文件
                await this.readM3U8File(data, url, toFile, toDirPath, protocolDomain, path)
                console.log('netlog-', '所有ts文件都下载成功了')
                // //标记下载成功

                // 写入本地数据库
                await AsyncStorage.setItem(Storage.videoChache, JSON.stringify(data))
            } catch (error) {
                console.log(error)
                this.allRunningTask.status = -1 //下载出现异常
            }
        } else {
            this.allRunningTask.status = -1
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
        let result = await fs.readFile(m3u8LocalFile);

        // console.log(result,"result")
        let lines = result.split('\n');

        let tsUrls = [];
        for (let line of lines) {
            if (line.endsWith('.jpg') || line.indexOf("jpg") > -1) {
                tsUrls.push(line)
            }
        }


        //开始下载key
        await this.startDownloadKey(`${protocolDomain}/${path}`, m3u8LocalDir)
        console.log("key 下载成功")


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
            fromUrl: url + "/key.key",
            toFile: toDir + "/key.key",

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
            console.log("所有碎片下载成功")
            return;
        };

        let url = tsUrls[index];
        //如果ts文件中包含域名 则说明为片头广告 暂时不下载
        if (url.indexOf(protocolDomain) > -1) {
            await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8LocalDir, protocolDomain)
            return
        }

        let downloadUrl = protocolDomain + url;  //网络地址
        let tsName = url.slice(url.lastIndexOf("/") + 1);
        let toFile = m3u8LocalDir + "/" + tsName; //本地地址
        let result = await this.createDownloadTSPromise(downloadUrl, toFile)


        console.log(index / tsUrls.length, url)
        //刷新进度
        this.allRunningTask.progress = (index + 1) / tsUrls.length;
        //通知出去
        this._updatelisteners()
        await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8LocalDir, protocolDomain)
    }

    /**
     * 创建ts下载任务
     * @param {*} url 
     * @param {*} file 
     */
    createDownloadTSPromise(url, file) {
        console.log(url, "url, file")
        let task = fs.downloadFile({
            fromUrl: url,
            toFile: file,
            cacheable: false,
            connectionTimeout: 1000 * 60 * 20,
            readTimeout: 1000 * 60 * 20,
            begin: function (res) {
            },
            progress: function (res) {
            },
        });
        return task.promise
    }


}

const DownloadManagerInstance = new DownloadManager()

export default DownloadManagerInstance;


