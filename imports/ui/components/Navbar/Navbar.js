import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

import './Navbar.scss';

const PublicNav = () => [
  <li key="login" className="nav-item">
    <span className="nav-link">
      <NavLink to="/login">
        <button type="button" className="dropdown-item">
          Login
        </button>
      </NavLink>
    </span>
  </li>,
];

const LoggedInNav = () => (
  <>
    <li className="nav-item">
      <NavLink to="/employee">
        <button type="button" className="dropdown-item">
          Employee
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li className="nav-item">
      <NavLink to="/project">
        <button type="button" className="dropdown-item">
          Project
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li className="nav-item">
      <NavLink to="/report">
        <button type="button" className="dropdown-item">
          Report
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li className="nav-item">
      <NavLink to="/profile">
        <button type="button" className="dropdown-item">
          Profile
        </button>
      </NavLink>
    </li>
    <li className="nav-item">
      <div className="dropdown-divider" />
    </li>
    <li>
      <NavLink to="#">
        <button
          type="button"
          className="dropdown-item"
          onClick={() => {
            NotificationManager.success('Logout', 'Success', 3000);
            setTimeout(Meteor.logout(), 100);
          }}
        >
          Logout
        </button>
      </NavLink>
    </li>
  </>
);

const Status = ({ loggedIn, isAdmin, isProjMan }) => (
  <div className="my-2 mr-3">
    {loggedIn ? (
      isAdmin ? (
        <span className="text-success">
          <i className="fa fa-circle" />
        </span>
      ) : isProjMan ? (
        <span className="text-warning">
          <i className="fa fa-circle" />
        </span>
      ) : (
        <span className="text-danger">
          <i className="fa fa-circle" />
        </span>
      )
    ) : (
      <span className="text-secondary">
        <i className="fa fa-circle" />
      </span>
    )}
  </div>
);

Status.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isProjMan: PropTypes.bool.isRequired,
};

const Navbar = ({ loggedIn, isAdmin, isProjMan }) => (
  <nav className="navbar navbar-expand-lg navbar-light">
    <Status loggedIn={loggedIn} isAdmin={isAdmin} isProjMan={isProjMan} />
    <span className="navbar-brand" href="#">
      <NavLink to="/">
        <span className="d-none d-sm-block">DC Resource Schedule</span>
        <span className="d-block d-sm-none">DCRS</span>
      </NavLink>
    </span>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
        {loggedIn ? <LoggedInNav /> : <PublicNav />}
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isProjMan: PropTypes.bool.isRequired,
};

export default Navbar;
