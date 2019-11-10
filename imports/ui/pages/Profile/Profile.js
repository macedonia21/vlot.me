import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TagsInput from 'react-tagsinput';
import { _ } from 'underscore';
import { NotificationManager } from 'react-notifications';
import { Accounts } from 'meteor/accounts-base';
import Select from 'react-select';

// collection

// components

// styles
import './Profile.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';

function getPasswordStrength(newPass) {
  const passwordStrength = {
    className: 'progress-bar bg-danger',
    width: '0%',
  };
  if (newPass.length === 0) {
    passwordStrength.className = 'progress-bar bg-danger';
    passwordStrength.width = '0%';
  } else {
    const strongRegex = new RegExp(
      '^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$',
      'g'
    );
    const mediumRegex = new RegExp(
      '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
      'g'
    );
    const enoughRegex = new RegExp('(?=.{6,}).*', 'g');

    if (!enoughRegex.test(newPass)) {
      passwordStrength.width = '25%';
    } else if (strongRegex.test(newPass)) {
      passwordStrength.className = 'progress-bar bg-success';
      passwordStrength.width = '100%';
    } else if (mediumRegex.test(newPass)) {
      passwordStrength.className = 'progress-bar bg-warning';
      passwordStrength.width = '75%';
    } else {
      passwordStrength.className = 'progress-bar bg-warning';
      passwordStrength.width = '50%';
    }
  }

  return passwordStrength;
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOldPasswordShown: false,
      isNewPasswordShown: false,
      isConfirmPasswordShown: false,
      oldPass: '',
      newPass: '',
      retypeNewPass: '',
      passwordStrength: {
        className: 'progress-bar bg-danger',
        width: '0%',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOldPasswordShow = this.handleOldPasswordShow.bind(this);
    this.handleNewPasswordShow = this.handleNewPasswordShow.bind(this);
    this.handleConfirmPasswordShow = this.handleConfirmPasswordShow.bind(this);
  }

  componentWillMount() {
    if (
      !Meteor.userId() ||
      (!Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin'))
    ) {
      return this.props.history.push('/not-found');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !Meteor.userId() &&
      (Roles.userIsInRole(Meteor.userId(), 'superadmin') ||
        Roles.userIsInRole(Meteor.userId(), 'admin'))
    ) {
      nextProps.history.push('/not-found');
      return false;
    }
    return nextProps !== this.props || nextState !== this.state;
  }

  handleOldPasswordShow() {
    this.setState({
      isOldPasswordShown: !this.state.isOldPasswordShown,
    });
  }

  handleOldPasswordShow() {
    this.setState({
      isOldPasswordShown: !this.state.isOldPasswordShown,
    });
  }

  handleNewPasswordShow() {
    this.setState({
      isNewPasswordShown: !this.state.isNewPasswordShown,
    });
  }

  handleConfirmPasswordShow() {
    this.setState({
      isConfirmPasswordShown: !this.state.isConfirmPasswordShown,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { user } = this.props;
    const { oldPass, newPass, retypeNewPass } = this.state;

    if (newPass === oldPass) {
      NotificationManager.error(
        'Cannot change password: New password must different from current password',
        'Error',
        3000
      );
      return;
    }

    if (newPass !== retypeNewPass) {
      NotificationManager.error(
        'Cannot change password: Confirm password not correct',
        'Error',
        3000
      );
      return;
    }

    Accounts.changePassword(oldPass, newPass, err => {
      if (err) {
        NotificationManager.error(
          `Cannot change password: ${err.message}`,
          'Error',
          3000
        );
      } else {
        NotificationManager.success(
          'Your password is changed, logout in few seconds',
          'Success',
          3000
        );
        setTimeout(() => {
          Meteor.logout(() => {
            this.props.history.push('/ketqua');
          });
        }, 1000);
      }
    });
  }

  render() {
    const { loggedIn, usersReady, user } = this.props;
    const {
      isOldPasswordShown,
      isNewPasswordShown,
      isConfirmPasswordShown,
      oldPass,
      newPass,
      retypeNewPass,
      passwordStrength,
    } = this.state;

    if (!loggedIn) {
      return null;
    }

    return (
      <section className="profile-page">
        <div className="card mx-auto" style={{ maxWidth: '80%' }}>
          <div className="card-header">
            <div className="card-body">
              <h1 className="card-title text-center">Đổi mật khấu</h1>
              {usersReady && (
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    {/* <!-- First Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Old Password --> */}
                      <div className="form-group">
                        <label htmlFor="oldpassword">Mật khấu cũ</label>
                        <div className="input-group">
                          <input
                            id="oldpassword"
                            type={isOldPasswordShown ? 'text' : 'password'}
                            className="form-control"
                            name="oldpassword"
                            value={oldPass}
                            onChange={e =>
                              this.setState({ oldPass: e.target.value })
                            }
                            required
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              id="button-addon1"
                              onClick={this.handleOldPasswordShow}
                            >
                              <span
                                className={
                                  isOldPasswordShown
                                    ? 'fa fa-eye'
                                    : 'fa fa-eye-slash'
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Second Col --> */}
                    <div className="col-md-4">
                      {/* <!-- New Password --> */}
                      <div
                        className="form-group"
                        style={{ marginBottom: '5px' }}
                      >
                        <label htmlFor="newpassword">Mật khấu mới</label>
                        <div className="input-group">
                          <input
                            id="newpassword"
                            type={isNewPasswordShown ? 'text' : 'password'}
                            className="form-control"
                            name="newpassword"
                            value={newPass}
                            onChange={e => {
                              this.setState({
                                newPass: e.target.value,
                                passwordStrength: getPasswordStrength(
                                  e.target.value
                                ),
                              });
                            }}
                            required
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              id="button-addon2"
                              onClick={this.handleNewPasswordShow}
                            >
                              <span
                                className={
                                  isNewPasswordShown
                                    ? 'fa fa-eye'
                                    : 'fa fa-eye-slash'
                                }
                              />
                            </button>
                          </div>
                        </div>
                        <div
                          className="progress"
                          style={{ height: '6px', marginTop: '5px' }}
                        >
                          <div
                            className={passwordStrength.className}
                            role="progressbar"
                            style={{ width: passwordStrength.width }}
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <!-- Third Col --> */}
                    <div className="col-md-4">
                      {/* <!-- Retype New Password --> */}
                      <div className="form-group">
                        <label htmlFor="newpasswordre">Nhập lại mật khấu</label>
                        <div className="input-group">
                          <input
                            id="newpasswordre"
                            type={isConfirmPasswordShown ? 'text' : 'password'}
                            className="form-control"
                            name="newpasswordre"
                            value={retypeNewPass}
                            onChange={e =>
                              this.setState({ retypeNewPass: e.target.value })
                            }
                            required
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              id="button-addon3"
                              onClick={this.handleConfirmPasswordShow}
                            >
                              <span
                                className={
                                  isConfirmPasswordShown
                                    ? 'fa fa-eye'
                                    : 'fa fa-eye-slash'
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group no-margin">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-2"
                    >
                      Đổi mật khấu
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Profile.defaultProps = {
  // users: null, remote example (if using ddp)
  user: null,
};

Profile.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  usersReady: PropTypes.bool.isRequired,
  user: PropTypes.objectOf(Meteor.user),
};

export default withTracker(props => {
  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find().fetch();
  const user = _.findWhere(users, { _id: Meteor.userId() });
  const usersReady = usersSub.ready() && !!users;

  return {
    usersReady,
    user,
  };
})(Profile);
