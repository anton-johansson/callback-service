import React, {Component} from 'react';
import {Button, Card, CardTitle, CardText, TextField} from 'react-md';
import {connect} from 'react-redux';
import './Main.css';

// API functions
import {logout} from '../api/auth/actions';
import {setProxyEndpoint, getProxyEndpoint} from '../api/proxy/actions';

class Main extends Component {
  constructor(props) {
      super(props);
      this.onLogout = this.onLogout.bind(this);
      this.onSetEndpoint = this.onSetEndpoint.bind(this);
      this.endpointRef = React.createRef();
  }

  componentDidMount() {
    this.props.dispatch(getProxyEndpoint());
  }

  onLogout() {
    this.props.dispatch(logout());
  }

  onSetEndpoint() {
    const endpoint = this.endpointRef.current.value;
    this.props.dispatch(setProxyEndpoint(endpoint));
  }

  render() {
    return (
      <Card className="Main-card">
        <CardTitle title="Callback proxy" subtitle={`for ${this.props.name}`} />
        <CardText>
          <TextField id="endpoint" label="Endpoint" type="text" defaultValue={this.props.proxyEndpoint} ref={this.endpointRef} />
          <p>
            <Button raised primary disabled={false} onClick={this.onSetEndpoint}>
              Set endpoint
            </Button>
            &nbsp;
            <Button raised primary onClick={this.onLogout}>
              Logout
            </Button>
          </p>
        </CardText>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
    username: state.authentication.username,
    name: state.authentication.name,
    proxyEndpoint: state.proxy.endpoint
});

export default connect(mapStateToProps)(Main);