import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';
import vi from 'date-fns/locale/vi'; // register Vietnamese locale
import * as Functions from '../../../../api/functions.js';

// Collection
import Rounds from '../../../../api/rounds/rounds';
import PredictRounds from '../../../../api/predictRounds/predictRounds';

// Styles
import './AddRound.scss';
import 'react-datepicker/dist/react-datepicker.css';
// the Vietnamese locale
registerLocale('vi', vi);

class AddRound extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Sending request
      sendingRequest: false,

      // Request data
      roundIndex: 0,
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
    this.onPredictRound = this.onPredictRound.bind(this);
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

  isVlotDate(date) {
    const day = date.getDay();
    return day !== 1 && day !== 2 && day !== 4 && day !== 6;
  }

  onAddRound(index) {
    const {
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
      roundIndex: index,
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

  onGetRound(index) {
    const requestData = {
      roundIndex: index,
    };
    Meteor.call('drawResult.get', requestData, (err, res) => {
      if (err) {
        NotificationManager.error(err.reason, 'Lỗi', 3000);
      } else {
        this.setState({
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
        NotificationManager.success(
          'Đọc thông tin lượt thành công',
          'Thành công',
          3000
        );
      }
    });
  }

  onPredictRound(index) {
    this.setState({ sendingRequest: true });

    Meteor.call('newPredictRound.post', index, err => {
      if (err) {
        NotificationManager.error(err.message, 'Lỗi', 3000);
      } else {
        NotificationManager.success(
          'Thêm lượt dự đoán thành công',
          'Thành công',
          3000
        );
        setTimeout(() => {
          this.setState({ sendingRequest: false });
        }, 1000);
      }
    });
  }

  render() {
    const {
      loggedIn,
      maxRoundIndexReady,
      maxRoundIndex,
      maxPredictRoundIndexReady,
      maxPredictRoundIndex,
    } = this.props;
    const {
      sendingRequest,

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

    const nextIndex = (maxRoundIndex[0] ? maxRoundIndex[0].index : 0) + 1;
    const nextPredictIndex =
      (maxPredictRoundIndex[0] ? maxPredictRoundIndex[0].index : 100) + 1;

    return (
      <div className="container">
        <h1>Thêm lượt</h1>
        <h3>Thêm lượt mới</h3>
        <form className="form-horizontal mb-4">
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="index">Lượt</label>
                <input
                  id="index"
                  type="number"
                  min="1"
                  max="99999"
                  className="form-control"
                  placeholder="0"
                  value={nextIndex}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="date">Ngày</label>
                <DatePicker
                  id="date"
                  locale="vi"
                  className="form-control"
                  todayButton="Hôm nay"
                  dateFormat="dd MMM yyyy"
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
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="price">Giải</label>
                <Cleave
                  id="price"
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
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="jackpot">Jackpot</label>
                <input
                  id="jackpot"
                  type="number"
                  min="0"
                  max="10"
                  className="form-control"
                  placeholder="0"
                  value={roundJackpot}
                  onChange={e => {
                    this.setState({ roundJackpot: e.target.value });
                  }}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-2">
              <div className="form-group">
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
            <div className="col-12 col-md-2">
              <div className="form-group">
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
            <div className="col-12 col-md-2">
              <div className="form-group">
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
            <div className="col-12 col-md-2">
              <div className="form-group">
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
            <div className="col-12 col-md-2">
              <div className="form-group">
                <input
                  type="number"
                  min="1"
                  max="45"
                  className="form-control new-round-result-num"
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
            <div className="col-12 col-md-2">
              <div className="form-group">
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
          <div className="btn-group btn-block" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.onAddRound(nextIndex)}
              disabled={!maxRoundIndexReady && sendingRequest}
            >
              Thêm lượt mới
            </button>
            <button
              type="button"
              className="btn btn-info"
              onClick={() => this.onGetRound(nextIndex)}
              disabled={!maxRoundIndexReady && sendingRequest}
            >
              Lấy kết quả
            </button>
          </div>
        </form>
        <h3>Thêm lượt dự đoán mới</h3>
        <form className="form-horizontal mb-4">
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="indexForecase">Lượt</label>
                <input
                  id="indexForecase"
                  type="number"
                  min="101"
                  max="99999"
                  className="form-control"
                  placeholder="0"
                  value={nextPredictIndex}
                  required
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="btn-group btn-block" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => this.onPredictRound(nextPredictIndex)}
            >
              Thêm lượt dự đoán mới
            </button>
          </div>
        </form>
      </div>
    );
  }
}

AddRound.defaultProps = {
  maxRoundIndex: 1,
  maxPredictRoundIndex: 101,
};

AddRound.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  maxRoundIndexReady: PropTypes.bool.isRequired,
  maxRoundIndex: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxPredictRoundIndexReady: PropTypes.bool.isRequired,
  maxPredictRoundIndex: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default withTracker(() => {
  const maxRoundIndexSub = Meteor.subscribe('maxRoundIndex');
  const maxRoundIndex = Rounds.find(
    {},
    {
      fields: {
        index: 1,
      },
      sort: { index: -1 },
      limit: 1,
    }
  ).fetch();
  const maxRoundIndexReady = maxRoundIndexSub.ready() && !!maxRoundIndex;
  const maxPredictRoundIndexSub = Meteor.subscribe('maxPredictRoundIndex');
  const maxPredictRoundIndex = PredictRounds.find(
    {},
    {
      fields: {
        index: 1,
      },
      sort: { index: -1 },
      limit: 1,
    }
  ).fetch();
  const maxPredictRoundIndexReady =
    maxPredictRoundIndexSub.ready() && !!maxPredictRoundIndex;
  return {
    maxRoundIndexReady,
    maxRoundIndex,
    maxPredictRoundIndexReady,
    maxPredictRoundIndex,
    currentUser: Meteor.user(),
  };
})(AddRound);
