import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cleave from 'cleave.js/react';
import { withTracker } from 'meteor/react-meteor-data';
import { Jobs } from 'meteor/msavin:sjobs';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResultDelta from '../../components/OneRoundResultDelta';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Delta.scss';

class Delta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Data
      skip: 0,
      page: 5,
      loadedFull: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    const { loggedIn, roundsReady, rounds } = this.props;
    const { skip, page, loadedFull } = this.state;

    let resultRender = [1].map(() => {
      return <h3 key={1}>Không tìm thấy kết quả</h3>;
    });

    if (rounds && rounds.length > 0) {
      resultRender = _.map(_.first(rounds, page * (1 + skip)), round => {
        return <OneRoundResultDelta key={round.index} roundData={round} />;
      });
    }

    return (
      <div className="container">
        <h1 className="animated fadeIn">Phân tích Delta</h1>
        <h5 className="animated fadeIn mb-4">
          <i>* Kết quả phân tích 50 lượt quay số gần nhất.</i>
        </h5>
        <h5 className="animated fadeIn mb-4">
          <i>
            * Delta là giá trị chênh lệch giữa 2 số liên tiếp trong 1 bộ 6 số.
            Delta bao gồm 5 số có giá trị từ 1 đến tối đa là 40.
          </i>
        </h5>
        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <div className="list-group result-list">{resultRender}</div>
        )}
        {roundsReady && !loadedFull && rounds && rounds.length > page && (
          <button
            type="button"
            className="btn btn-primary btn-block mb-4"
            onClick={() => {
              this.setState({
                skip: skip + 1,
                loadedFull: page * (2 + skip) >= Math.min(50, rounds.length),
              });
            }}
          >
            Tải thêm
          </button>
        )}
      </div>
    );
  }
}

Delta.defaultProps = {
  rounds: null,
};

Delta.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const roundsSub = Meteor.subscribe('rounds50Latest');
  const rounds = Rounds.find(
    {},
    {
      sort: { index: -1 },
      limit: 50,
    }
  ).fetch();
  const roundsReady = roundsSub.ready() && !!rounds;
  return {
    roundsReady,
    rounds,
    currentUser: Meteor.user(),
  };
})(Delta);
