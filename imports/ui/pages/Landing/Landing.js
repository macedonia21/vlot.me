import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './Landing.scss';

class Landing extends React.Component {
  componentWillMount() {
    if (Meteor.userId()) {
      return this.props.history.push('/report');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (Meteor.userId()) {
      nextProps.history.push('/report');
      return false;
    }
    return true;
  }

  render() {
    if (this.props.loggedIn) {
      return null;
    }
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row landing-image">
            <div className="col-lg-8" />
            <div className="col-lg-4 text-center title-col">
              <div>
                <h1>
                  Welcome to
                  <br />
                  DC Resource Schedule
                </h1>
                <NavLink role="button" className="btn btn-primary" to="/login">
                  Login
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Landing;
