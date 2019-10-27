import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';

// Styles
import './AddRound.scss';
import 'react-datepicker/dist/react-datepicker.css';

class AddRound extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Sending request
      sendingRequest: false,

      // Request data
      roundIndex: 1,
      roundDate: new Date(),
      roundPrice: 12000000000,
      roundJackpot: 0,
      roundNo1: 1,
      roundNo2: 2,
      roundNo3: 3,
      roundNo4: 4,
      roundNo5: 5,
      roundNo6: 6,
    };

    this.onAddRound = this.onAddRound.bind(this);
    this.onGetRound = this.onGetRound.bind(this);
  }

  componentWillMount() {
    // if (Meteor.userId()) {
    //   return this.props.history.push('/report');
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  isVlotDate(date) {
    const day = date.getDay();
    return day !== 1 && day !== 2 && day !== 4 && day !== 6;
  }

  onAddRound() {
    const {
      roundIndex,
      roundDate,
      roundPrice,
      roundJackpot,
      roundNo1,
      roundNo2,
      roundNo3,
      roundNo4,
      roundNo5,
      roundNo6,
    } = this.state;

    const requestData = {
      roundIndex,
      roundDate,
      roundPrice,
      roundJackpotCount: roundJackpot,
      roundNo1,
      roundNo2,
      roundNo3,
      roundNo4,
      roundNo5,
      roundNo6,
    };

    this.setState({ sendingRequest: true });

    Meteor.call('insertNewRound.post', requestData, err => {
      if (err) {
        NotificationManager.error(err.reason, 'Lỗi', 3000);
      } else {
        NotificationManager.success('Thêm lượt thành công', 'Thành công', 3000);
      }
      setTimeout(() => {
        this.setState({ sendingRequest: false });
      }, 1000);
    });
  }

  onGetRound() {
    const requestData = {
      roundIndex: this.state.roundIndex,
    };
    Meteor.call('drawResult.get', requestData, (err, res) => {
      if (err) {
        NotificationManager.error(err.reason, 'Error', 3000);
      } else {
        this.setState({
          roundIndex: res.index,
          roundDate: new Date(res.registered),
          roundPrice: res.price,
          roundJackpot: res.jackpotCount,
          roundNo1: res.result.num1,
          roundNo2: res.result.num2,
          roundNo3: res.result.num3,
          roundNo4: res.result.num4,
          roundNo5: res.result.num5,
          roundNo6: res.result.num6,
        });
        NotificationManager.success('Done', 'Success', 3000);
      }
    });
  }

  render() {
    const {
      roundIndex,
      roundDate,
      roundPrice,
      roundJackpot,
      roundNo1,
      roundNo2,
      roundNo3,
      roundNo4,
      roundNo5,
      roundNo6,
    } = this.state;

    if (this.props.loggedIn) {
      return null;
    }
    return (
      <div className="container">
        <h1>Thêm lượt</h1>
        <form className="form-horizontal">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="col-xs-4 control-label">Lượt</label>
                <div className="col-xs-8">
                  <input
                    type="number"
                    min="1"
                    max="99999"
                    className="form-control"
                    placeholder="0"
                    value={roundIndex}
                    onChange={e => {
                      this.setState({ roundIndex: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="col-xs-4 control-label">Ngày</label>
                <div className="col-xs-8">
                  <DatePicker
                    className="form-control"
                    todayButton="Hôm nay"
                    dateFormat="MMM dd, yyyy"
                    selected={roundDate}
                    minDate={new Date('2016-07-20')}
                    maxDate={new Date()}
                    filterDate={this.isVlotDate}
                    onChange={date => {
                      this.setState({ roundDate: date });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="col-xs-4 control-label">Giải</label>
                <div className="col-xs-8">
                  <Cleave
                    className="form-control"
                    placeholder="12.000.000.000"
                    options={{
                      numeral: true,
                      numeralDecimalMark: ',',
                      delimiter: '.',
                    }}
                    value={roundPrice}
                    onChange={e => {
                      this.setState({ roundPrice: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="col-xs-4 control-label">Jackpot</label>
                <div className="col-xs-8">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="form-control"
                    placeholder="0"
                    value={roundJackpot}
                    onChange={e => {
                      this.setState({ roundJackpotCount: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    size="2"
                    placeholder="0"
                    value={roundNo1}
                    onChange={e => {
                      this.setState({ roundNo1: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    size="2"
                    placeholder="0"
                    value={roundNo2}
                    onChange={e => {
                      this.setState({ roundNo2: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    size="2"
                    placeholder="0"
                    value={roundNo3}
                    onChange={e => {
                      this.setState({ roundNo3: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    size="2"
                    placeholder="0"
                    value={roundNo4}
                    onChange={e => {
                      this.setState({ roundNo4: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    ref="roundNo5"
                    size="2"
                    placeholder="0"
                    value={roundNo5}
                    onChange={e => {
                      this.setState({ roundNo5: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-xs-2">
              <div className="form-group">
                <div className="col-xs-12">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    className="form-control new-round-result-num"
                    size="2"
                    placeholder="0"
                    value={roundNo6}
                    onChange={e => {
                      this.setState({ roundNo6: e.target.value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onAddRound}
            >
              Thêm lượt mới
            </button>
            <button
              type="button"
              className="btn btn-info"
              onClick={this.onGetRound}
            >
              Lấy kết quả
            </button>
          </div>
        </form>
      </div>
    );
  }
}

AddRound.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default AddRound;
