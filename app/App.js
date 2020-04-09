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
            url: ""
        }
    }
    /* /20200322/vqPFuj4e/800kb/hls/key.key */
    componentDidMount() {
        // //  console.log(RNBackgroundDownloader.directories.documents,"RNBackgroundDownloader.directories.documents")
        // const storeLocation = `${RNFS.DocumentDirectoryPath}`;
        // console.log(RNBackgroundDownloader.directories.documents, "RNBackgroundDownloader.directories.documents")
        // console.log(storeLocation, "storeLocation")

        // create a path you want to write to
        // let path = RNFS.DocumentDirectoryPath + '/qzspMove';
        // let server = new StaticServer(8080, path);
        // // Start the server
        // server.start().then((url) => {
        //     console.log("Serving at URL", url);
        // });
    }

    render() {
        


        return (
            <View style={{ paddingTop: 40 }}>
                <Text onPress={() => new DownloadManager().startDownloadM3U8({url:"https://cdnal.aofdn.com/20200322/vqPFuj4e/800kb/hls/index.m3u8"})}> 下载 </Text>
                {/* <Text onPress={() => this.props.navigation.navigate("PlayMove")}>播放</Text> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({})
