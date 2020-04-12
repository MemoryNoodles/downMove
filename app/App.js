import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import RNBackgroundDownloader from 'react-native-background-downloader';

import Video from 'react-native-video';
import CryptoJS from "crypto-js"

import DownloadManager from "../myDownload"

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0
        }
    }

    componentDidMount() {
        console.log(this)
       
        DownloadManager.addListener(this.callback)
       
    }

    componentWillUnmount() {
      
        DownloadManager.removeListener(this.callback)
    }

    callback = () => {
        //正在进行中的任务
        let runningTask = DownloadManager.allRunningTask;
        let progress = runningTask.progress * 100;
        this.setState({
            progress: progress.toFixed(2) + "%"
        })
    }

    render() {
        const { progress } = this.state
        /* https://cdnal.aofdn.com/20200331/AttyIWNA//800kb/hls/index.m3u8? */
        /* https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/index.m3u8 */
        return (
            <View style={{ paddingTop: 40 }}>
                <Text onPress={() => DownloadManager.startDownloadM3U8({ url: "https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/index.m3u8" })}> 下载 </Text>
                <Text>{progress}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
