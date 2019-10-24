import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './EmployeeCard.scss';

const EmployeeCard = ({ user, isAdmin, isProjMan, zIndex }) => (
  <div className="col-xs-12 col-sm-6 col-md-4 emp-card">
    <div className="image-flip">
      <div className="mainflip" style={{ zIndex }}>
        <div className="frontside">
          {user && (
            <div className={user.disabled ? 'card disabled-card' : 'card'}>
              <div className="card-body text-center">
                <p style={{ height: '120px' }}>
                  {user.todayAssignmentProject && (isAdmin || isProjMan) && (
                    <NavLink
                      to={`/project/assignment/${
                        user.todayAssignmentProject._id
                      }`}
                    >
                      <span
                        className={
                          user.disabled
                            ? 'badge badge-pill badge-secondary emp-img-badge'
                            : 'badge badge-pill badge-primary emp-img-badge'
                        }
                      >
                        {user.disabled
                          ? 'Inactive'
                          : user.todayAssignmentProject.projectName}
                      </span>
                    </NavLink>
                  )}
                  {user.todayAssignmentProject && !isAdmin && !isProjMan && (
                    <span
                      className={
                        user.disabled
                          ? 'badge badge-pill badge-secondary emp-img-badge'
                          : 'badge badge-pill badge-primary emp-img-badge'
                      }
                    >
                      {user.disabled
                        ? 'Inactive'
                        : user.todayAssignmentProject.projectName}
                    </span>
                  )}
                  {!user.todayAssignmentProject && (
                    <span
                      className={
                        user.disabled
                          ? 'badge badge-pill badge-secondary emp-img-badge'
                          : 'badge badge-pill badge-danger emp-img-badge'
                      }
                    >
                      {user.disabled ? 'Inactive' : 'Available'}
                    </span>
                  )}
                  <span
                    className={
                      user.disabled
                        ? 'img-wrap secondary-border'
                        : user.todayAssignmentProject
                        ? 'img-wrap primary-border'
                        : 'img-wrap danger-border'
                    }
                  >
                    <img
                      className="img-fluid"
                      src={
                        user.profile.avatar
                          ? user.profile.avatar
                          : '/img/avatar_placeholder.png'
                      }
                      alt="Broken link"
                    />
                  </span>
                </p>

                <h4 className="card-title">
                  {(isAdmin || isProjMan) && (
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="emp-fullname">
                          {user.profile.fullName}
                        </span>
                        &nbsp;
                        <span
                          className={
                            user.disabled
                              ? 'badge badge-pill badge-secondary'
                              : 'badge badge-pill badge-warning'
                          }
                        >
                          {user.profile.posTitle}
                        </span>
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <NavLink
                          className="dropdown-item"
                          to={`/employee/${user._id}`}
                        >
                          {isAdmin ? 'Update Employee' : 'Employee Profile'}
                        </NavLink>
                        {!user.disabled && (isAdmin || isProjMan) && (
                          <NavLink
                            className="dropdown-item"
                            to={`/employee/assignment/${user._id}`}
                          >
                            Assignments
                          </NavLink>
                        )}
                        {!user.disabled && isAdmin && (
                          <NavLink
                            className="dropdown-item"
                            to={`/employee/resetpassword/${user._id}`}
                          >
                            Reset Password
                          </NavLink>
                        )}
                      </div>
                    </div>
                  )}
                  {!isAdmin && !isProjMan && (
                    <>
                      <span className="emp-fullname">
                        {user.profile.fullName}
                      </span>
                      &nbsp;
                      <span
                        className={
                          user.disabled
                            ? 'badge badge-pill badge-secondary'
                            : 'badge badge-pill badge-warning'
                        }
                      >
                        {user.profile.posTitle}
                      </span>
                    </>
                  )}
                </h4>

                <p className="card-text">{user.profile.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

EmployeeCard.defaultProps = {
  // users: null, remote example (if using ddp)
  zIndex: 1,
};

EmployeeCard.propTypes = {
  user: PropTypes.objectOf(Meteor.user),
  isAdmin: PropTypes.bool.isRequired,
  isProjMan: PropTypes.bool.isRequired,
  zIndex: PropTypes.number,
};

export default EmployeeCard;
