import React, { Component } from 'react';
import './App.css';
import { SnackSession } from 'snack-sdk';
var QRCode = require('qrcode.react');

const INITIAL_CODE = `
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Change code in the editor and watch it change on your phone!
          Save to get a shareable url. You get a new url each time you save.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
`;

class App extends Component {
  constructor(props) {
    super(props);

    const code = INITIAL_CODE;

    this._snack = new SnackSession({
      code,
    });

    this.state = {
      url: '',
      code,
    };
  }

  componentWillMount() {
    this._startSnack();
  }

  async _startSnack() {
    await this._snack.startAsync();
    let url = await this._snack.getUrlAsync();
    this.setState({
      url,
    });
  }

  _updateCode = async (event) => {
    const code = event.target.value;
    this.setState({
      code,
    });
    this._snack.sendCodeAsync(code);
  }

  render() {
    return (
      <div>
        <h2>{this.state.url}</h2>
        <div style={{padding: 20}}>
          <QRCode value={this.state.url}/>
        </div>
        <div>
          <textarea value={this.state.code} onChange={this._updateCode} style={{width: 300, height: 300}}/>
        </div>
      </div>
    );
  }
}

export default App;
