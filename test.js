import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
 
import queueFactory from 'react-native-queue';
 
export default class App extends Component  {
 
  constructor(props) {
    super(props);
 
    this.state = {
      queue: null
    };
 
    this.init();
 
  }
 
  async init() {
 
    const queue = await queueFactory(); 
    //
    // Recursive Job Example
    // This job creates itself over and over.
    //
    let recursionCounter = 1;
    queue.addWorker('recursive-example', async (id, payload) => {
      console.log('recursive-example job '+ id +' started');
      console.log(recursionCounter, 'recursionCounter');
 
      recursionCounter++;
 
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('recursive-example '+ id +' has completed!');
 
          // Keep creating these jobs until counter reaches 3.
          if (recursionCounter <= 3) {
              queue.createJob('recursive-example');
          }
 
          resolve();
        }, 1000);
      });
 
    });
 
    
 
    // Start queue to process any jobs that hadn't finished when app was last closed.
    queue.start();
 
    // Attach initialized queue to state.
    this.setState({
      queue
    });
 
  }
 
  makeJob(jobName, payload = {}) {
    this.state.queue.createJob(jobName, payload);
  }
 
  render() {
 
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        {this.state.queue && <Button title={"Press For Standard Example"} onPress={ () => { this.makeJob('standard-example') } } /> }
        {this.state.queue && <Button title={"Press For Recursive Example"} onPress={ () => { this.makeJob('recursive-example') } } /> }
        {this.state.queue && <Button title={"Press For Job Chain Example"} onPress={ () => { this.makeJob('start-job-chain', { step: 1 }) } } /> }
      </View>
    );
 
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});