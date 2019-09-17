import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
};

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }

  render() {
    const { redirectToReferrer } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (redirectToReferrer === true) {
      return (
        <Redirect to={from} />
      )
    }

    return (
      <div>
        <p>You must login to view this page at {from.pathname}</p>
        <button onClick={this.login}>Login</button>
      </div>
    )
  }
};

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )}/>
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated === true
    ? <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>
        Sign out
      </button>
    </p>
    : <p>You are not logged in</p>
))

function App() {
  return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li><Link to='/public'>Public page</Link></li>
          <li><Link to='/protected'>Protected page</Link></li>
        </ul>

        <Route path='/public' component={Public} />
        <Route path='/login' component={Login} />
        <PrivateRoute path='/protected' component={Protected} />
      </div>
    </Router>
  );
}

export default App;
