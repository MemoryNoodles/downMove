import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from "react-native-fs"
import Video from 'react-native-video';
import CryptoJS from "crypto-js"
import StaticServer from 'react-native-static-server';
 

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
        let path = RNFS.DocumentDirectoryPath + '/qzspMove';

        let server = new StaticServer(8080, path);
        // Start the server
        server.start().then((url) => {
            console.log("Serving at URL", url);
        });
    }

    render() {
        const { url } = this.state


        return (
            <View style={{ paddingTop: 40 }}>
                <Text onPress={() => this.down()}> 下载 </Text>

                {/* <Video source={{ uri: "file:///android_asset/origin.m3u8" }}
                    style={{ width: 500, height: 300, backgroundColor: "#000" }} /> */}
                <Text onPress={() => { }}> 播放 </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
