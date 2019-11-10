import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';
import { Jobs } from 'meteor/msavin:sjobs';

// Styles
import './MonitorJobs.scss';

class MonitorJobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Sending request
      sendingRequest: false,
    };

    this.handleAllJobsStart = this.handleAllJobsStart.bind(this);
    this.handleAllJobsStop = this.handleAllJobsStop.bind(this);
    this.handleGetResultJobRegister = this.handleGetResultJobRegister.bind(
      this
    );
    this.handleGetResultJobStart = this.handleGetResultJobStart.bind(this);
    this.handleGetResultJobStop = this.handleGetResultJobStop.bind(this);
    this.handleGetResultJobClear = this.handleGetResultJobClear.bind(this);
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

  handleAllJobsStart() {
    Meteor.call('allJobs.start', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success(
          'Tất cả tác vụ bắt đầu chạy',
          'Thành công',
          3000
        );
      }
    });
  }

  handleAllJobsStop() {
    Meteor.call('allJobs.stop', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success(
          'Đã dừng tất cả tác vụ',
          'Thành công',
          3000
        );
      }
    });
  }

  handleGetResultJobRegister() {
    Meteor.call('getResultJob.register', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success(
          'Đăng ký tác vụ thành công',
          'Thành công',
          3000
        );
      }
    });
  }

  handleGetResultJobStart() {
    Meteor.call('getResultJob.start', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success('Tác vụ bắt đầu chạy', 'Thành công', 3000);
      }
    });
  }

  handleGetResultJobStop() {
    Meteor.call('getResultJob.stop', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success('Đã dừng tác vụ', 'Thành công', 3000);
      }
    });
  }

  handleGetResultJobClear() {
    Meteor.call('getResultJob.clear', (err, res) => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success('Đã hủy tác vụ', 'Thành công', 3000);
      }
    });
  }

  render() {
    const { loggedIn } = this.props;

    return (
      <div className="container">
        <h1>Quản lý tác vụ ngầm</h1>
        <h5 className="animated fadeIn mb-4">
          <i>Tất cả tác vụ</i>
        </h5>
        <div className="row animated fadeIn">
          <div className="col-12 offset-md-3 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-primary"
              onClick={this.handleAllJobsStart}
              disabled={false}
            >
              Chạy tất cả
            </button>
          </div>
          <div className="col-12 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-warning"
              onClick={this.handleAllJobsStop}
              disabled={false}
            >
              Dừng tất cả
            </button>
          </div>
        </div>
        <h5 className="animated fadeIn mb-4">
          <i>Tác vụ lấy kết quả</i>
        </h5>

        <div className="row animated fadeIn">
          <div className="col-12 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-success"
              onClick={this.handleGetResultJobRegister}
              disabled={false}
            >
              Đăng ký
            </button>
          </div>
          <div className="col-12 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-primary"
              onClick={this.handleGetResultJobStart}
              disabled={false}
            >
              Chạy
            </button>
          </div>
          <div className="col-12 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-warning"
              onClick={this.handleGetResultJobStop}
              disabled={false}
            >
              Dừng
            </button>
          </div>
          <div className="col-12 col-md-3 mb-4 chart-wrap">
            <button
              type="button"
              className="btn btn-block btn-danger"
              onClick={this.handleGetResultJobClear}
              disabled={false}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }
}

MonitorJobs.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default MonitorJobs;
