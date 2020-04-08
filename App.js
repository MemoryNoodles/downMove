import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from "react-native-fs"
import Video from 'react-native-video';
import CryptoJS from "crypto-js"


// const key = CryptoJS.enc.Utf8.parse("0373ac119ec8caca");  //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('OV1xTfizP4DRKAfP');   //十六位十六进制数作为密钥偏移量

// //解密方法
// function Decrypt(word) {
//     let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
//     let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
//     let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
//     let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
//     return decryptedStr.toString();
// }
// console.log(Decrypt("/20200322/vqPFuj4e/800kb/hls/HfWYO2ao.jpg"))

var aa = async () => {
    let result = await RNFS.readFile(`file://${RNFS.DocumentDirectoryPath}/index.jpg`, "base64")
    console.log(result, "result")
    var bytes = CryptoJS.AES.decrypt(result, "0373ac119ec8caca");

    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(bytes, originalText)
}
aa()


// const m3u8stream = require('m3u8stream')
//  import HLSDownloader from 'hlsdownloader' //Using ES2015 module

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            url: ""
        }
    }
    /* /20200322/vqPFuj4e/800kb/hls/key.key */
    componentDidMount() {
        // //  console.log(RNBackgroundDownloader.directories.documents,"RNBackgroundDownloader.directories.documents")
        // const storeLocation = `${RNFS.DocumentDirectoryPath}`;
        // console.log(RNBackgroundDownloader.directories.documents, "RNBackgroundDownloader.directories.documents")
        // console.log(storeLocation, "storeLocation")
    }
    down() {
        // fetch("https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/index.m3u8").then(res=>{
        //     console.log(res)
        // })
        console.log("down")
        const options = {
            // fromUrl: "https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/index.m3u8",
            //fromUrl: "https://cdnal.aofdn.com/20200324/nUIaszdF/800kb/hls/index.m3u8",
            // fromUrl: "https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/key.key",
            fromUrl: "https://cdnal.aofdn.com//20200322/vqPFuj4e/800kb/hls/HfWYO2ao.jpg",

            //fromUrl: "https://up.imgupio.com/demo/birds.m3u8",
            toFile: `${RNFS.DocumentDirectoryPath}/index.jpg`,
            background: true,
            begin: (res) => {
                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                console.log(pro)
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            console.log(333)
            ret.promise.then(res => {
                console.log('success', res);
                //  this.readM3U8File()
            }).catch(err => {
                console.log('err', err);
            });
        }
        catch (e) {
            console.log(error);
        }

    }
    async readM3U8File() {
        // console.log(`file://${RNFS.DocumentDirectoryPath}/index.m3u8`)
        //  let result = await RNFS.readFile(`file://${RNFS.DocumentDirectoryPath}/index.m3u8`)
        let result = await RNFS.readFile(`file://${RNFS.DocumentDirectoryPath}/index.jpg`, "base64")
        console.log(result)
        // RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        // .then((result) => {
        //   console.log('GOT RESULT', result);

        //   // stat the first file
        //   return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        // })
        // .then((statResult) => {
        //   if (statResult[0].isFile()) {
        //     // if we have a file, read it
        //     return RNFS.readFile(statResult[1], 'utf8');
        //   }

        //   return 'no file';
        // })
        // .then((contents) => {
        //   // log the file contents
        //   console.log(contents);
        // })
        // .catch((err) => {
        //   console.log(err.message, err.code);
        // });
        //let lines = result.split('\n');

        // let tsUrls = [];
        // for (let line of lines) {
        //     if (line.endsWith('.jpg')) {
        //         tsUrls.push(line)
        //     }
        // }
        //开始下载ts文件
        // this.startDownloadTS(`${RNFS.DocumentDirectoryPath}/index.m3u8`, tsUrls, 1);
    }
    async startDownloadTS(localM3u8Url, tsUrls, index) {
        //console.log('tsUrls.length',tsUrls.length);
        if (index >= tsUrls.length) {
            return;
        };

        let url = tsUrls[0];
        let url2 = tsUrls[1];
        let url3 = tsUrls[2];
        console.log(url, url2, url3, "单个ts url")

        //如果ts文件中包含路径，当文件夹形式处理
        // if (url.lastIndexOf("/") > -1) {
        //     let targetDir = baseFile + url.substring(0, url.lastIndexOf('/'));

        //     let exists = await fs.exists(targetDir)
        //     //console.warn('exists'+exists);

        //     if (!exists) {
        //         await fs.mkdir(targetDir)
        //     }
        // }

        // let downloadUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf("/") + 1) + url.substring(url.lastIndexOf('/') + 1);
        // //console.log('TS分片url', downloadUrl)

        // //console.warn('TS分片url', url.substring(url.lastIndexOf('/')+1))
        // let toFile = baseFile + url;
        // let tofile_exists = await fs.exists(toFile);
        // if (!tofile_exists) {
        //     console.log('缓存位置tt', downloadUrl, toFile);

        //     let result = await this.createDownloadTSPromise(downloadUrl, toFile)
        //     //console.log('netlog-ts下载成功了', toFile, downloadUrl, result)
        // }



        // await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8Dir)
    }
    async play() {
        let Url = `${RNFS.DocumentDirectoryPath}/index.m3u8`
        console.log('file://' + Url)
        //   let file = RNFS.exists(`${RNFS.DocumentDirectoryPath}/index.m3u8`)
        // file.then(res => {
        //     console.log(res)
        // })

        // let resultM3u8 = await RNFS.readFile('file://' + Url);

        // let lines = resultM3u8.split('\n');
        // let lineTemp = '';

        // /* 安卓和ios不一样 */
        // for (let line of lines) {
        //     //console.log(line);
        //     if (line.endsWith('.jpg') || line.indexOf("jpg") > -1) {
        //         line = '.' + line;
        //     }
        //     if (line.endsWith('.key') || line.indexOf(".key") > -1) {
        //         line = line.substring(0, line.indexOf('/')) + '.' + line.substring(line.indexOf('/'));
        //     }
        //     console.log(lineTemp, "lineTemp", line, "lineTemp")
        //     lineTemp = lineTemp + line + '\n';
        // }

        // await fs.writeFile(`${RNFS.DocumentDirectoryPath}/index_.m3u8`, lineTemp);
    }
    render() {
        const { url } = this.state


        return (
            <View style={{ paddingTop: 40 }}>
                <Text onPress={() => this.down()}> textInComponent </Text>
                {/* <Video source={{ uri: "file:///android_asset/HfWYO2ao.jpg" }}  */}
                <Video source={{uri:"file:///android_asset/origin.m3u8"}}

                    style={{ width: 500, height: 300, backgroundColor: "#000" }} />
                <Text onPress={() => this.readM3U8File()}> 下载ts </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
