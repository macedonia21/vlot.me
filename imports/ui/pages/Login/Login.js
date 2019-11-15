import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import ReCAPTCHA from 'react-google-recaptcha';

// import components
import Alert from '../../components/Alert';

// import styles
import './Login.scss';
import 'react-notifications/lib/notifications.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isPasswordShown: false,
      recaptchaRef: React.createRef(),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordShow = this.handlePasswordShow.bind(this);
    this.reCaptchaChange = this.reCaptchaChange.bind(this);
  }

  componentWillMount() {
    if (Meteor.userId()) {
      return this.props.history.push('/themluot');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (Meteor.userId()) {
      nextProps.history.push('/themluot');
      return false;
    }
    return true;
  }

  handlePasswordShow() {
    this.setState({
      isPasswordShown: !this.state.isPasswordShown,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.state.recaptchaRef.current.execute();
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, err => {
      if (err) {
        NotificationManager.error(`Cannot login: ${err.reason}`, 'Error', 3000);
      }
      this.setState({ password: '' });
    });
  }

  reCaptchaChange(value) {
    return null;
  }

  render() {
    const { isPasswordShown, email, password } = this.state;

    if (this.props.loggedIn) {
      return null;
    }

    // const recaptchaRef = React.createRef();

    return (
      <section className="login-page">
        <div
          className="card mx-auto"
          style={{ width: '28rem', maxWidth: '80%' }}
        >
          <div className="card-header">
            <div className="card-body">
              <h1 className="card-title text-center">Đăng nhập</h1>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Tài khoản</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={e => this.setState({ email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <div className="input-group">
                    <input
                      id="password"
                      type={isPasswordShown ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                      required
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon1"
                        onClick={this.handlePasswordShow}
                      >
                        <span
                          className={
                            isPasswordShown ? 'fa fa-eye' : 'fa fa-eye-slash'
                          }
                        />
                      </button>
                    </div>
                  </div>
                  {1 === 2 && (
                    <NavLink className="invisible" to="/recover-password">
                      Forgot Password?
                    </NavLink>
                  )}
                </div>
                <div className="form-group no-margin text-webkit-center">
                  <ReCAPTCHA
                    ref={this.state.recaptchaRef}
                    size="invisible"
                    sitekey="6Lcy9cEUAAAAABwzST0q1Dx57nPKT4jGbpVIqTEA"
                  />
                </div>
                <div className="form-group no-margin">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-2"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;

Login.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
