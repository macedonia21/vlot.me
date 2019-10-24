import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment/moment';

// collection
import Projects from '../../../api/projects/projects';
import Assignments from '../../../api/assignments/assignments';

// components
import EmployeeCard from '../../components/EmployeeCard';
import EmployeeAddCard from '../../components/EmployeeAddCard';
import PulseLoader from '../../components/PulseLoader/PulseLoader';

import './EmployeeList.scss';

class EmployeeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginRoles: {
        admin: false,
        projMan: false,
      },
      filterFullname: '',
      filterTalents: [],
      filterAvailableToday: false,
      filterActiveOnly: true,
    };
    this.handleActiveClick = this.handleActiveClick.bind(this);
  }

  componentWillMount() {
    if (!Meteor.userId()) {
      return this.props.history.push('/login');
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!Meteor.userId()) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }

  handleActiveClick() {
    this.setState({
      filterActiveOnly: !this.state.filterActiveOnly,
    });
  }

  render() {
    const {
      loggedIn,
      projectsReady,
      projects,
      usersReady,
      users,
      assignmentsReady,
      assignments,
    } = this.props;
    const {
      loginRoles,
      filterFullname,
      filterTalents,
      filterAvailableToday,
      filterActiveOnly,
    } = this.state;

    if (Meteor.userId()) {
      if (
        Roles.userIsInRole(Meteor.userId(), 'superadmin') ||
        Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        loginRoles.admin = true;
      }
      if (Roles.userIsInRole(Meteor.userId(), 'projman')) {
        loginRoles.projMan = true;
      }
    }

    if (!loggedIn) {
      return null;
    }

    let filteredUsers = _.map(users, user => {
      // Find today Assignment
      const todayAssignment = _.find(assignments, assignment => {
        const todayObj = moment();
        const assignStartDateObj = moment(assignment.startDate);
        const assignEndDateObj = moment(assignment.endDate);
        return (
          assignment._employeeId === user._id &&
          assignStartDateObj.isSameOrBefore(todayObj, 'day') &&
          assignEndDateObj.isSameOrAfter(todayObj, 'day')
        );
      });

      let todayAssignmentProject;
      if (todayAssignment) {
        todayAssignmentProject = _.findWhere(projects, {
          _id: todayAssignment._projectId,
        });
      }

      // Find today Project
      return {
        ...user,
        todayAssignment,
        todayAssignmentProject,
      };
    });
    // Filter by Fullname
    if (filterFullname) {
      filteredUsers = _.filter(filteredUsers, user => {
        return user.profile.fullName
          .toLowerCase()
          .includes(filterFullname.toLowerCase());
      });
    }
    // Filter by Capabilities
    if (_.size(filterTalents) > 0) {
      filteredUsers = _.filter(filteredUsers, user => {
        return _.every(filterTalents, filterTag => {
          return _.some(
            _.map(user.profile.talents, capaTag => {
              return capaTag.toLowerCase().includes(filterTag.toLowerCase());
            })
          );
        });
      });
    }
    // Filter by Available Today
    if (filterAvailableToday) {
      filteredUsers = _.filter(filteredUsers, user => {
        return !user.todayAssignment;
      });
    }
    // Filter by Active indicator
    if (filterActiveOnly) {
      filteredUsers = _.filter(filteredUsers, user => {
        return !user.disabled;
      });
    }
    // Sort by Fullname
    filteredUsers = _.sortBy(filteredUsers, user => {
      return user.profile.fullName;
    });

    const usersCount = _.size(filteredUsers);

    return (
      <div className="employee-page">
        <h1 className="mb-4">Employees</h1>
        <div className="container">
          <div className="row">
            <EmployeeAddCard disabled={!loginRoles.admin} />

            {/* <!-- Search Card --> */}
            <div className="col-xs-12 col-sm-6 col-md-8 emp-search-card">
              <div className="image-flip">
                <div className="mainflip">
                  <div className="frontside">
                    <div className="card">
                      <div className="card-body">
                        <form>
                          <div className="row">
                            {/* <!-- First Col --> */}
                            <div className="col-md-12">
                              <h1 className="text-center">Filter Employee</h1>
                            </div>
                          </div>

                          <div className="row">
                            {/* <!-- First Col --> */}
                            <div className="col-md-6">
                              {/* <!-- First Name --> */}
                              <div className="form-group">
                                <label htmlFor="searchname">
                                  Search by Fullname
                                </label>
                                <input
                                  id="searchname"
                                  type="text"
                                  className="form-control"
                                  name="searchname"
                                  value={filterFullname}
                                  onChange={e =>
                                    this.setState({
                                      filterFullname: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              {/* <!-- Available Today --> */}
                              <div className="form-group">
                                <div
                                  className="btn-group btn-block"
                                  role="group"
                                  aria-label="Available Today"
                                >
                                  <button
                                    type="button"
                                    className={
                                      filterAvailableToday
                                        ? 'btn btn-primary'
                                        : 'btn btn-secondary'
                                    }
                                    onClick={() => {
                                      this.setState({
                                        filterAvailableToday: true,
                                      });
                                    }}
                                    disabled={
                                      !loginRoles.admin && !loginRoles.projMan
                                    }
                                  >
                                    Available Today
                                  </button>
                                  <button
                                    type="button"
                                    className={
                                      filterAvailableToday
                                        ? 'btn btn-secondary'
                                        : 'btn btn-primary'
                                    }
                                    onClick={() => {
                                      this.setState({
                                        filterAvailableToday: false,
                                      });
                                    }}
                                    disabled={
                                      !loginRoles.admin && !loginRoles.projMan
                                    }
                                  >
                                    All
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* <!-- Second Col --> */}
                            <div className="col-md-6">
                              {/* <!-- Talents --> */}
                              <div className="form-group">
                                <label htmlFor="talents">
                                  Search by Capabilities
                                </label>
                                <TagsInput
                                  id="talents"
                                  className="form-control"
                                  value={filterTalents}
                                  maxTags={3}
                                  onChange={tags =>
                                    this.setState({
                                      filterTalents: tags,
                                    })
                                  }
                                />
                              </div>

                              {/* <!-- Active --> */}
                              {loginRoles.admin && (
                                <div className="form-group">
                                  <button
                                    type="button"
                                    className={
                                      filterActiveOnly
                                        ? 'btn btn-block btn-primary'
                                        : 'btn btn-block btn-secondary'
                                    }
                                    onClick={this.handleActiveClick}
                                  >
                                    {filterActiveOnly
                                      ? 'Active Users Only'
                                      : 'Include Inactive Users'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(!usersReady || !projectsReady || !assignmentsReady) && (
              <PulseLoader />
            )}

            {usersReady &&
              projectsReady &&
              assignmentsReady &&
              _.map(filteredUsers, (user, index) => {
                return (
                  <EmployeeCard
                    user={user}
                    key={user._id}
                    isAdmin={loginRoles.admin}
                    isProjMan={loginRoles.projMan}
                    zIndex={usersCount - index}
                  />
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

EmployeeList.defaultProps = {
  // users: null, remote example (if using ddp)
  users: null,
};

EmployeeList.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  projectsReady: PropTypes.bool.isRequired,
  projects: Projects ? PropTypes.array.isRequired : () => null,
  usersReady: PropTypes.bool.isRequired,
  users: Meteor.user() ? PropTypes.array.isRequired : () => null,
  assignmentsReady: PropTypes.bool.isRequired,
  assignments: Assignments ? PropTypes.array : () => null,
};

export default withTracker(() => {
  const projectsSub = Meteor.subscribe('projects.all'); // publication needs to be set on remote server
  const projects = Projects.find().fetch();
  const projectsReady = projectsSub.ready() && !!projects;

  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find().fetch();
  const usersReady = usersSub.ready() && !!users;

  const assignmentsSub = Meteor.subscribe('assignments.all'); // publication needs to be set on remote server
  const assignments = Assignments.find().fetch();
  const assignmentsReady = assignmentsSub.ready() && !!assignments;

  return {
    projectsReady,
    projects,
    usersReady,
    users,
    assignmentsReady,
    assignments,
  };
})(EmployeeList);
