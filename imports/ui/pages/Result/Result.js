import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

// Collection
import Rounds from '../../../api/rounds/rounds';

// Components
import OneRoundResult from '../../components/OneRoundResult';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

// Styles
import './Result.scss';

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Data
      resultData: [],
      skip: 0,
      page: 5,
      loadedFull: false,
    };
  }

  componentDidMount() {
    // this.fetchResultData();
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
        return <OneRoundResult key={round.index} roundData={round} />;
      });
    }

    console.log(rounds);

    return (
      <div className="container">
        <h1>Kết quả theo ngày (50 lượt gần nhất)</h1>
        {!roundsReady && <PulseLoader />}
        {roundsReady && (
          <div className="list-group result-list">{resultRender}</div>
        )}
        {roundsReady && !loadedFull && (
          <button
            type="button"
            className="btn btn-primary btn-block mt-4"
            onClick={() => {
              this.setState({
                skip: skip + 1,
                loadedFull: page * (1 + skip) >= 50,
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

Result.defaultProps = {
  rounds: null,
};

Result.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  roundsReady: PropTypes.bool.isRequired,
  rounds: Rounds ? PropTypes.array.isRequired : () => null,
};

export default withTracker(() => {
  const roundsSub = Meteor.subscribe('rounds50Latest');
  const rounds = Rounds.find().fetch();
  const roundsReady = roundsSub.ready() && !!rounds;
  return {
    roundsReady,
    rounds,
    currentUser: Meteor.user(),
  };
})(Result);
