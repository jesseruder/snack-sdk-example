import React, { Component } from 'react';
import './App.css';
import { SnackSession } from 'snack-sdk';
import QRCode from 'qrcode.react';

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
      // sessionId is optional, will be assigned a random value if not specified
      sessionId: Math.random().toString(36).substring(7),
    });

    this._logSubscription = this._snack.addLogListener(this._onLog);
    this._errorSubscription = this._snack.addErrorListener(this._onError);
    this._presenceSubscription = this._snack.addPresenceListener(this._onPresence);

    this.state = {
      url: '',
      code,
      log: null,
      error: null,
      presence: null,
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

  _onChangeCode = async (event) => {
    const code = event.target.value;
    this.setState({
      code,
    });
    await this._snack.sendCodeAsync(code);
  }

  _onLog = (log) => {
    this.setState({
      log: JSON.stringify(log, null, 2),
    });
  }

  _onError = (error) => {
    console.log(JSON.stringify(error));
    this.setState({
      error: JSON.stringify(error, null, 2),
    });
  }

  _onPresence = (presence) => {
    console.log(JSON.stringify(presence));
    this.setState({
      presence: JSON.stringify(presence, null, 2),
    });
  }

  _removeListeners = () => {
    this._logSubscription.remove();
    this._errorSubscription.remove();
    this._presenceSubscription.remove();
  }

  render() {
    return (
      <div>
        <div>{this.state.url}</div>
        <div style={{padding: 20}}>
          <QRCode value={this.state.url}/>
        </div>
        <div>
          <textarea value={this.state.code} onChange={this._onChangeCode} style={{width: 300, height: 300}}/>
        </div>
        <div>
          Last log:
          <pre>
            {this.state.log}
          </pre>
        </div>
        <div>
          Last error:
          <pre>
            {this.state.error}
          </pre>
        </div>
        <div>
          Last presence event:
          <pre>
            {this.state.presence}
          </pre>
        </div>
        <div>
          <a href="#" onClick={this._removeListeners}>
            Remove Listeners
          </a>
        </div>
      </div>
    );
  }
}

export default App;
