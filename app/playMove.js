import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import Video from 'react-native-video';
import StaticServer from 'react-native-static-server';
import RNFS from "react-native-fs"

export default class PlayMove extends Component {
    componentDidMount(){
          // create a path you want to write to
        let path = RNFS.DocumentDirectoryPath + '/qzspMove';
        let server = new StaticServer(8080, path);
        // Start the server
        server.start().then((url) => {
            
        });
    }
    render() {
        return (
            <View>
                  <Video source={{ uri: `file://${RNFS.DocumentDirectoryPath}/qzspMove` }}
                    style={{ width: 500, height: 300, backgroundColor: "#000" }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
