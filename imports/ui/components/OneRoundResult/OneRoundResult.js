import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import '../../../api/moment_vi';

class OneRoundResult extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props !== nextProps;
  }

  render() {
    const { roundData } = this.props;

    return (
      <div className="list-group-item fadeIn animated">
        <div className="row">
          <div className="col-md-6 col-sm-8 col-8">
            <h4 className="list-group-item-heading d-none d-sm-block">
              {moment(roundData.registered)
                .locale('vi')
                .format('LLLL')}
            </h4>
            <h4 className="list-group-item-heading d-block d-sm-none">
              {moment(roundData.registered)
                .locale('vi')
                .format('llll')}
            </h4>
          </div>
          <div className="col-md-6 col-sm-4 col-4 text-right">
            <span className="badge badge-pill badge-warning">
              {`Lượt ${roundData.index}`}
            </span>
          </div>
        </div>
        <div className="list-group-item-text round-result result-num">
          <span className="round-result-num">{roundData.result.num1}</span>
          <span className="round-result-num">{roundData.result.num2}</span>
          <span className="round-result-num">{roundData.result.num3}</span>
          <span className="round-result-num">{roundData.result.num4}</span>
          <span className="round-result-num">{roundData.result.num5}</span>
          <span className="round-result-num">{roundData.result.num6}</span>
          <div className="list-group-item-text round-result result-stat">
            <a className="round-result-char-link" href="/xacsuat">
              <span
                className="round-result-stat"
                data-tip
                data-for={`C${roundData.even}-${roundData.odd}L`}
              >
                {`C${roundData.even} / ${roundData.odd}L`}
              </span>
            </a>
            <ReactTooltip id="C0-6L" type="dark">
              <span>C0/6L</span>
            </ReactTooltip>
            <ReactTooltip id="C1-5L" type="dark">
              <span>C1/5L</span>
            </ReactTooltip>
            <ReactTooltip id="C2-4L" type="dark">
              <span>C2/4L</span>
            </ReactTooltip>
            <ReactTooltip id="C3-3L" type="dark">
              <span>C3/3L</span>
            </ReactTooltip>
            <ReactTooltip id="C4-2L" type="dark">
              <span>C4/2L</span>
            </ReactTooltip>
            <ReactTooltip id="C5-1L" type="dark">
              <span>C5/1L</span>
            </ReactTooltip>
            <ReactTooltip id="C6-0L" type="dark">
              <span>C6/0L</span>
            </ReactTooltip>
            <span className="round-result-stat">
              {`T${roundData.high} / ${roundData.low}X`}
            </span>
            <span className="round-result-stat">{`T${roundData.sum}`}</span>
            <span className="round-result-stat">{roundData.lastNumType}</span>
            <span className="round-result-stat">{roundData.seqNumType}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('rounds50Latest');
  return {
    currentUser: Meteor.user(),
  };
})(OneRoundResult);
