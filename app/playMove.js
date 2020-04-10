import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage } from 'react-native'
import Video from 'react-native-video';
import StaticServer from 'react-native-static-server';
import RNFS from "react-native-fs"
import Storage from "../util/storage"

export default class PlayMove extends Component {
    constructor(props){
        super(props)
        this.state = {
            url:""
        }
    }
    componentDidMount() {
       this.setServer()
  
    }
    async setServer(){
           //create a path you want to write to
           let path = RNFS.DocumentDirectoryPath+"/qzspMove";
           this.server = new StaticServer(8088, path,{localOnly : true } );
         //  Start the server
           
         this.server.start().then((url) => {
             //  console.log(url,"url")
               this.setState({
                   url
               },()=>{
                   this.getMovies()
               })
           });
          
    }
    async getMovies( ) {
       
        // const isRunning = await  this.server.isRunning()
        // console.log(isRunning,"isRunning")
       
        const { url } = this.state
        console.log(this.server,url,"this.server")
        // let resultLocal=await RNFS.readdir(`${RNFS.DocumentDirectoryPath}/qzspMove/20200322/vqPFuj4e/800kb/hls`) 
        // let resultLocal2=await RNFS.readdir(`${url}/qzspMove/20200322/vqPFuj4e/800kb/hls`) 
        // console.log(resultLocal, resultLocal2)
        // console.log(`${url}/qzspMove/20200322/vqPFuj4e/800kb/hls/index.m3u8`)
    //   let result1 =await RNFS.exists(`${url}/www/20200322/vqPFuj4e/800kb/hls/index.m3u8`)
    //      let resultLocal=await RNFS.exists(`${RNFS.DocumentDirectoryPath}/www/20200322/vqPFuj4e/800kb/hls/index.m3u8`)
    //      console.log(result1, resultLocal)
        // let movies =await AsyncStorage.getItem(Storage.videoChache);
        // console.log(JSON.parse(movies))
    }
    render() {
        const { url } = this.state;
       if(!url) return null 

        return (
            <View>
                <Text>22</Text>
                {/* <Video source={{ uri: `${RNFS.DocumentDirectoryPath}/qzspMove/20200322/vqPFuj4e/800kb/hls/index.m3u8` }}
                    style={{ width: 500, height: 300, backgroundColor: "#000" }} /> */}
                <Video source={{ uri: `${url}/20200322/vqPFuj4e/800kb/hls/index.m3u8`}}
                    style={{ width: 500, height: 300, backgroundColor: "#000" }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
