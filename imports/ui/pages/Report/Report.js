import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';
import numeral from 'numeral';
import { Chart } from 'react-google-charts';
import { Roles } from 'meteor/alanning:roles';
import { NavLink } from 'react-router-dom';

// collection
import Projects from '../../../api/projects/projects';
import Assignments from '../../../api/assignments/assignments';

// components
import PulseLoader from '../../components/PulseLoader/PulseLoader';

import './Report.scss';
import 'react-datepicker/dist/react-datepicker.css';

// functions
function getDateRange(startDate, stopDate) {
  const dateRange = new Array();

  const startDateObj = moment(startDate);
  const stopDateObj = moment(stopDate);

  let currentDate = startDateObj;

  while (currentDate.isSameOrBefore(stopDateObj, 'day')) {
    dateRange.push(new Date(currentDate));
    currentDate = moment(currentDate).add(1, 'd');
  }
  return dateRange;
}

function getInRangeAssignments(startDate, stopDate, assignments) {
  const startDateObj = moment(startDate);
  const stopDateObj = moment(stopDate);

  return _.filter(assignments, assignment => {
    const assignStartDateObj = moment(assignment.startDate);
    const assignStopDateObj = moment(assignment.endDate);

    return (
      assignStartDateObj.isSameOrBefore(stopDateObj, 'day') &&
      assignStopDateObj.isSameOrAfter(startDateObj, 'day')
    );
  });
}

function getChartBenchByDateDataItems(dateRange, assignments, users) {
  return _.map(dateRange, date => {
    const currentDateObj = moment(date);

    const assignmentsOnDateCount = _.filter(assignments, assignment => {
      const assignStartDateObj = moment(assignment.startDate);
      const assignStopDateObj = moment(assignment.endDate);

      return (
        assignStartDateObj.isSameOrBefore(currentDateObj, 'day') &&
        assignStopDateObj.isSameOrAfter(currentDateObj, 'day')
      );
    });

    const unassignedUserOnDate = _.reject(users, user => {
      return _.contains(
        _.unique(_.pluck(assignmentsOnDateCount, '_employeeId')),
        user._id
      );
    });

    return [
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      _.size(
        _.filter(unassignedUserOnDate, user => {
          return user.profile.base === 'HCM';
        })
      ),
      _.size(
        _.filter(unassignedUserOnDate, user => {
          return user.profile.base === 'HN';
        })
      ),
    ];
  });
}

function getChartBenchByModuleDataItems(unassignedUsers) {
  const moduleList = _.uniq(
    _.flatten(
      _.map(unassignedUsers, user => {
        return user.profile.talents;
      })
    )
  );

  return _.map(moduleList, module => {
    return [
      module,
      _.size(
        _.filter(unassignedUsers, user => {
          return (
            _.contains(user.profile.talents, module) &&
            user.profile.base === 'HCM'
          );
        })
      ),
      _.size(
        _.filter(unassignedUsers, user => {
          return (
            _.contains(user.profile.talents, module) &&
            user.profile.base === 'HN'
          );
        })
      ),
    ];
  });
}

function getChartBenchByLevelDataItems(unassignedUsers) {
  const levelList = _.sortBy(
    _.map(
      _.uniq(
        _.map(unassignedUsers, user => {
          return user.profile.posTitle;
        })
      ),
      level => {
        return [
          level === 'BA'
            ? 0
            : level === 'C'
            ? 1
            : level === 'SC'
            ? 2
            : level === 'M'
            ? 3
            : level === 'SM'
            ? 4
            : 5,
          level,
        ];
      }
    ),
    level => {
      return level[0];
    }
  );

  return _.map(levelList, level => {
    return [
      level[1],
      _.size(
        _.filter(unassignedUsers, user => {
          return (
            user.profile.posTitle === level[1] && user.profile.base === 'HCM'
          );
        })
      ),
      _.size(
        _.filter(unassignedUsers, user => {
          return (
            user.profile.posTitle === level[1] && user.profile.base === 'HN'
          );
        })
      ),
    ];
  });
}

function getUnassignedEmployeesDetails(
  startDate,
  endDate,
  unassignedUsers,
  assignments
) {
  return _.map(unassignedUsers, user => {
    const startDateObj = moment(startDate);
    const endDateObj = moment(endDate);

    // Find last assignment
    const lastAssignment = _.max(
      _.filter(assignments, assignment => {
        const assignEndDateObj = moment(assignment.endDate);
        return (
          assignEndDateObj.isBefore(startDateObj) &&
          assignment._employeeId === user._id
        );
      }),
      assignment => {
        return assignment.endDate;
      }
    );

    // Find next assignment
    const nextAssignment = _.min(
      _.filter(assignments, assignment => {
        const assignStartDateObj = moment(assignment.startDate);
        return (
          assignStartDateObj.isAfter(endDateObj) &&
          assignment._employeeId === user._id
        );
      }),
      assignment => {
        return assignment.startDate;
      }
    );

    return {
      ...user,
      lastAssign: lastAssignment.endDate
        ? `On bench from ${moment(lastAssignment.endDate)
            .add(1, 'days')
            .format('MMM DD, YY')}`
        : 'No assignment before',
      nextAssign: nextAssignment.startDate
        ? `Next assignment ${moment(nextAssignment.startDate).format(
            'MMM DD, YY'
          )}`
        : 'Available',
      nextAssignTextClass: nextAssignment.startDate
        ? ''
        : 'text-danger bold-text',
    };
  });
}

function getAssignedEmployeesDetails(users, inRangeAssignments, projects) {
  const assignedUsers = _.filter(users, user => {
    return _.contains(
      _.uniq(_.pluck(inRangeAssignments, '_employeeId')),
      user._id
    );
  });

  return _.map(assignedUsers, user => {
    return {
      ...user,
      inRangeAssignmentsOfUser: _.sortBy(
        _.map(
          _.filter(inRangeAssignments, assignment => {
            return assignment._employeeId === user._id;
          }),
          assignment => {
            return {
              ...assignment,
              projectName: _.findWhere(projects, { _id: assignment._projectId })
                .projectName,
            };
          }
        ),
        assignment => {
          return assignment.startDate;
        }
      ),
    };
  });
}

function getAboutToUnassignedEmployeesDetails(
  assignments,
  unassignedUsers,
  users,
  startDate,
  endDate
) {
  const currentDateObj = moment();
  const startDateObj = moment(startDate);
  const endDateObj = moment(endDate);

  // Find assignments of currently assigned user with current or future assignments
  const currentOrFututeAssignments = _.reject(assignments, assignment => {
    const assignEndDateObj = moment(assignment.endDate);
    return (
      _.contains(_.pluck(unassignedUsers, '_id'), assignment._employeeId) ||
      assignEndDateObj.isSameOrBefore(currentDateObj, 'day')
    );
  });

  // Find users from currentOrFututeAssignments
  return _.filter(
    _.map(
      _.filter(users, user => {
        return _.contains(
          _.uniq(_.pluck(currentOrFututeAssignments, '_employeeId')),
          user._id
        );
      }),
      user => {
        const currentOrFututeAssignmentsOfUser = _.filter(
          currentOrFututeAssignments,
          assignment => {
            return assignment._employeeId === user._id;
          }
        );

        const furthestAssignmentOfUser = _.max(
          currentOrFututeAssignmentsOfUser,
          assignment => {
            return assignment.endDate;
          }
        );

        const currentOrFututeAssignmentsOfUserCount = _.size(
          currentOrFututeAssignmentsOfUser
        );

        return {
          ...user,
          furthestAssignment: furthestAssignmentOfUser,
          onBench: `${currentOrFututeAssignmentsOfUserCount} ${
            currentOrFututeAssignmentsOfUserCount > 1
              ? 'assignments'
              : 'assignment'
          } until ${moment(furthestAssignmentOfUser.endDate).format(
            'MMM DD, YYYY'
          )}`,
        };
      }
    ),
    user => {
      const assignEndDateObj = moment(user.furthestAssignment.endDate);
      return assignEndDateObj.isSameOrBefore(endDateObj, 'day');
    }
  );
}

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginRoles: {
        admin: false,
        projMan: false,
      },
      startDate: new Date(),
      endDate: new Date(moment().add(1, 'M')),
      chartData: {
        benchByDateData: {},
        benchByModuleData: {},
        benchByLevelData: {},
      },
      filterAssignedUsers: '',
      filterUnassignedUsers: '',
    };
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
      startDate,
      endDate,
      chartData,
      filterAssignedUsers,
      filterUnassignedUsers,
    } = this.state;

    if (!loggedIn) {
      return null;
    }

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

    // Filter assignments of ACTIVE users only
    const activeAssignments = _.filter(assignments, assignment => {
      return _.contains(
        _.map(users, user => {
          return user._id;
        }),
        assignment._employeeId
      );
    });

    // Summary
    const inRangeAssignments = getInRangeAssignments(
      startDate,
      endDate,
      activeAssignments
    );

    const unassignedUsers = _.reject(users, user => {
      return _.contains(
        _.unique(_.pluck(inRangeAssignments, '_employeeId')),
        user._id
      );
    });
    const unassignedProjects = _.reject(projects, project => {
      return _.contains(
        _.unique(_.pluck(inRangeAssignments, '_projectId')),
        project._id
      );
    });

    const userCount = _.size(users);
    const projectCount = _.size(projects);
    const assignmentCount = _.size(inRangeAssignments);
    const assignedUsertCount = _.size(
      _.unique(_.pluck(inRangeAssignments, '_employeeId'))
    );
    const unassignedUsertCount = _.size(unassignedUsers);
    const unassignedProjectCount = _.size(unassignedProjects);
    const assignedUsertCountPercent = numeral(
      (assignedUsertCount / userCount) * 100
    ).format('0.0');
    const unassignedUsertCountPercent = numeral(
      (unassignedUsertCount / userCount) * 100
    ).format('0.0');

    // On bench by date data
    const dateRange = getDateRange(startDate, endDate); // Common used

    const chartBenchByDateDataDeclare = ['x', 'HCM', 'HN'];
    const chartBenchByDateDataItems = getChartBenchByDateDataItems(
      dateRange,
      inRangeAssignments,
      users
    );
    let chartBenchByDateDataCombine = [];
    chartBenchByDateDataCombine.push(chartBenchByDateDataDeclare);
    chartBenchByDateDataCombine = _.union(
      chartBenchByDateDataCombine,
      chartBenchByDateDataItems
    );
    chartData.benchByDateData = chartBenchByDateDataCombine;

    // On bench by module data
    const chartBenchByModuleDataDeclare = ['x', 'HCM', 'HN'];
    const chartBenchByModuleDataItems = getChartBenchByModuleDataItems(
      unassignedUsers
    );
    let chartBenchByModuleDataCombine = [];
    chartBenchByModuleDataCombine.push(chartBenchByModuleDataDeclare);
    if (_.size(chartBenchByModuleDataItems) > 0) {
      chartBenchByModuleDataCombine = _.union(
        chartBenchByModuleDataCombine,
        chartBenchByModuleDataItems
      );
    } else {
      chartBenchByModuleDataCombine = _.union(chartBenchByModuleDataCombine, [
        ['No data', 0, 0],
      ]);
    }
    chartData.benchByModuleData = chartBenchByModuleDataCombine;

    // On bench by level data
    const chartBenchByLevelDataDeclare = ['x', 'HCM', 'HN'];
    const chartBenchByLevelDataItems = getChartBenchByLevelDataItems(
      unassignedUsers
    );
    let chartBenchByLevelDataCombine = [];
    chartBenchByLevelDataCombine.push(chartBenchByLevelDataDeclare);
    if (_.size(chartBenchByLevelDataItems) > 0) {
      chartBenchByLevelDataCombine = _.union(
        chartBenchByLevelDataCombine,
        chartBenchByLevelDataItems
      );
    } else {
      chartBenchByLevelDataCombine = _.union(chartBenchByLevelDataCombine, [
        ['No data', 0, 0],
      ]);
    }
    chartData.benchByLevelData = chartBenchByLevelDataCombine;

    // Unassign Employee Detail
    const unassignedUsersDetailsFull = getUnassignedEmployeesDetails(
      startDate,
      endDate,
      unassignedUsers,
      activeAssignments
    );
    let unassignedUsersDetails = unassignedUsersDetailsFull;
    if (filterUnassignedUsers) {
      unassignedUsersDetails = _.filter(unassignedUsersDetails, user => {
        return (
          user.profile.fullName
            .toLowerCase()
            .includes(filterUnassignedUsers.toLowerCase()) ||
          _.some(
            _.map(user.profile.talents, capaTag => {
              return capaTag
                .toLowerCase()
                .includes(filterUnassignedUsers.toLowerCase());
            })
          )
        );
      });
    }

    // Assign Employee Detail
    const assignedUsersDetailsFull = getAssignedEmployeesDetails(
      users,
      inRangeAssignments,
      projects
    );
    let assignedUsersDetails = assignedUsersDetailsFull;
    if (filterAssignedUsers) {
      assignedUsersDetails = _.filter(assignedUsersDetails, user => {
        return (
          user.profile.fullName
            .toLowerCase()
            .includes(filterAssignedUsers.toLowerCase()) ||
          _.some(
            _.map(user.profile.talents, capaTag => {
              return capaTag
                .toLowerCase()
                .includes(filterAssignedUsers.toLowerCase());
            })
          )
        );
      });
    }

    // // Employees about to unassigned
    // const aboutToUnassignedEmployeesDetails = getAboutToUnassignedEmployeesDetails(
    //   assignments,
    //   unassignedUsers,
    //   users,
    //   startDate,
    //   endDate
    // );

    return (
      <div className="report-page">
        <h1 className="mb-4">Report</h1>

        {(!usersReady || !projectsReady || !assignmentsReady) && (
          <PulseLoader />
        )}

        {projectsReady && usersReady && assignmentsReady && (
          <div className="container">
            <div className="row">
              {/* <!-- Filter Card --> */}
              <div className="col-xs-12 col-sm-12 col-md-12 report-filter-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body">
                          <form>
                            <div className="row">
                              {/* <!-- First Col --> */}
                              <div className="col-md-6">
                                {/* <!-- Start Date --> */}
                                <div className="form-group">
                                  <label htmlFor="startdate">Start Date</label>
                                  <DatePicker
                                    className="form-control"
                                    selected={startDate}
                                    onChange={date =>
                                      this.setState({
                                        startDate: date,
                                      })
                                    }
                                    maxDate={endDate}
                                    dateFormat="MMM dd, yyyy"
                                    disabled={
                                      !loginRoles.admin && !loginRoles.projMan
                                    }
                                  />
                                </div>
                              </div>

                              {/* <!-- Second Col --> */}
                              <div className="col-md-6">
                                {/* <!-- End Date --> */}
                                <div className="form-group">
                                  <label htmlFor="enddate">End Date</label>
                                  <DatePicker
                                    className="form-control"
                                    selected={endDate}
                                    onChange={date =>
                                      this.setState({
                                        endDate: date,
                                      })
                                    }
                                    minDate={startDate}
                                    dateFormat="MMM dd, yyyy"
                                    disabled={
                                      !loginRoles.admin && !loginRoles.projMan
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Summary Cards - Employees --> */}
              <div className="col-xs-12 col-sm-12 col-md-4 report-summary-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <p>
                            <span className="card-summary-title">
                              {userCount}
                            </span>
                          </p>
                          <h4 className="card-title">employees</h4>
                          <p className="card-text">{`and ${projectCount} projects`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Summary Cards - Assigned --> */}
              <div className="col-xs-12 col-sm-12 col-md-4 report-summary-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <a href="#anchor-assigned-users">
                        <div className="card">
                          <div className="card-body text-center">
                            <p>
                              <span className="card-summary-title">
                                {assignedUsertCount}
                              </span>
                            </p>
                            <h4 className="card-title">
                              assigned&nbsp;
                              <span className="badge badge-pill badge-warning">
                                {`${assignedUsertCountPercent}%`}
                              </span>
                            </h4>
                            <p className="card-text">{`in ${assignmentCount} assignments`}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- Summary Cards - Unassigned --> */}
              <div className="col-xs-12 col-sm-12 col-md-4 report-summary-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <a href="#anchor-unassigned-users">
                        <div className="card">
                          <div className="card-body text-center">
                            <p>
                              <span className="card-summary-title">
                                {unassignedUsertCount}
                              </span>
                            </p>
                            <h4 className="card-title">
                              on bench&nbsp;
                              <span className="badge badge-pill badge-warning">
                                {`${unassignedUsertCountPercent}%`}
                              </span>
                            </h4>
                            <p className="card-text">{`${unassignedProjectCount} unassigned projects`}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Chart Cards - On Bench by Geo --> */}
              {/* <div className="col-xs-12 col-sm-12 col-md-12 report-chart-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <Chart
                            width="auto"
                            height="312px"
                            chartType="GeoChart"
                            loader={<div>Chart loading...</div>}
                            data={[
                              ['Country', 'Popularity', 'Area'],
                              ['VN', 500, 1],
                              ['TH', 600, 2],
                              ['MY', 800, 3],
                              ['SG', 300, 5],
                              ['ID', 600, 4],
                            ]}
                            options={{
                              region: '035',
                              legend: {
                                textStyle: { fontName: 'Roboto' },
                              },
                              tooltip: {
                                textStyle: { fontName: 'Roboto' },
                              },
                            }}
                            // Note: you will need to get a mapsApiKey for your project.
                            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                            mapsApiKey="AIzaSyBPOucYIW9dV9wsMCWhfav_3meDJu2zghs"
                            rootProps={{ 'data-testid': '4' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <!-- Chart Cards - On Bench by Date --> */}
              <div className="col-xs-12 col-sm-12 col-md-12 report-chart-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <Chart
                            width="auto"
                            height="312px"
                            chartType="LineChart"
                            loader={<div>Chart loading...</div>}
                            data={chartData.benchByDateData}
                            options={{
                              fontName: 'Roboto',
                              title: `On bench by date from ${moment(
                                startDate
                              ).format('MMM DD, YYYY')} to ${moment(
                                endDate
                              ).format('MMM DD, YYYY')}`,
                              titleTextStyle: {
                                fontSize: 16,
                              },
                              hAxis: {
                                title: 'Date',
                              },
                              vAxis: {
                                title: 'On bench employees',
                                minValue: 0,
                              },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Chart Cards - On Bench by Module --> */}
              <div className="col-xs-12 col-sm-12 col-md-6 report-chart-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <Chart
                            width="auto"
                            height="300px"
                            chartType="BarChart"
                            loader={<div>Chart loading...</div>}
                            data={chartData.benchByModuleData}
                            options={{
                              fontName: 'Roboto',
                              title: 'On bench by module',
                              titleTextStyle: {
                                fontSize: 16,
                              },
                              chartArea: { width: '50%' },
                              hAxis: {
                                title: 'Employees',
                                minValue: 0,
                              },
                              vAxis: {
                                title: 'Module',
                              },
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '2' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Chart Cards - On Bench by Level --> */}
              <div className="col-xs-12 col-sm-12 col-md-6 report-chart-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body text-center">
                          <Chart
                            width="auto"
                            height="300px"
                            chartType="BarChart"
                            loader={<div>Chart loading...</div>}
                            data={chartData.benchByLevelData}
                            options={{
                              fontName: 'Roboto',
                              title: 'On bench by level',
                              titleTextStyle: {
                                fontSize: 16,
                              },
                              chartArea: { width: '50%' },
                              hAxis: {
                                title: 'Employees',
                                minValue: 0,
                              },
                              vAxis: {
                                title: 'Level',
                              },
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '3' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Unassign User Cards --> */}
              <div className="col-xs-12 col-sm-12 col-md-12 unassign-emp-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card" id="anchor-unassigned-users">
                        <div className="card-body">
                          <h1 className="text-center">Unassigned Employees</h1>
                          <form>
                            <div className="row">
                              <div className="col-sm-12 col-md-4">
                                <div className="form-group">
                                  <input
                                    id="assignedsearch"
                                    type="text"
                                    className="form-control"
                                    name="assignedsearch"
                                    value={filterUnassignedUsers || ''}
                                    onChange={e =>
                                      this.setState({
                                        filterUnassignedUsers: e.target.value,
                                      })
                                    }
                                    placeholder="Search Employee"
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                          {unassignedUsersDetails &&
                            _.map(unassignedUsersDetails, (user, index) => {
                              return (
                                <div key={user._id}>
                                  {index > 0 && <hr />}
                                  <div className="row">
                                    <div className="col-md-3 pb-2 pt-2 assign-name-text">
                                      {(loginRoles.admin ||
                                        loginRoles.projMan) && (
                                        <NavLink
                                          to={`/employee/assignment/${
                                            user._id
                                          }`}
                                        >
                                          {user.profile.fullName}
                                          &nbsp;
                                          <span className="badge badge-pill badge-warning">
                                            {user.profile.posTitle}
                                          </span>
                                        </NavLink>
                                      )}
                                      {!loginRoles.admin &&
                                        !loginRoles.projMan && (
                                          <>
                                            {user.profile.fullName}
                                            &nbsp;
                                            <span className="badge badge-pill badge-warning">
                                              {user.profile.posTitle}
                                            </span>
                                          </>
                                        )}
                                    </div>
                                    <div className="col-md-1 pb-2 pt-2">
                                      {user.profile.base}
                                    </div>
                                    <div className="col-md-3 pb-2 pt-2">
                                      {user.lastAssign}
                                    </div>
                                    <div
                                      className={
                                        user.nextAssignTextClass
                                          ? `col-md-3 pb-2 pt-2 ${
                                              user.nextAssignTextClass
                                            }`
                                          : 'col-md-3 pb-2 pt-2'
                                      }
                                    >
                                      {user.nextAssign}
                                    </div>
                                    <div className="col-md-2 pb-2 pt-2">
                                      {user.profile.talents
                                        ? _.map(
                                            user.profile.talents,
                                            talent => {
                                              return (
                                                <span
                                                  className="react-tagsinput-tag mb-1"
                                                  key={talent}
                                                >
                                                  {talent}
                                                </span>
                                              );
                                            }
                                          )
                                        : ''}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Assigned User Cards --> */}
              <div className="col-xs-12 col-sm-12 col-md-12 assign-emp-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card" id="anchor-assigned-users">
                        <div className="card-body">
                          <h1 className="text-center">Assigned Employees</h1>
                          <form>
                            <div className="row">
                              <div className="col-sm-12 col-md-4">
                                <div className="form-group">
                                  <input
                                    id="assignedsearch"
                                    type="text"
                                    className="form-control"
                                    name="assignedsearch"
                                    value={filterAssignedUsers || ''}
                                    onChange={e =>
                                      this.setState({
                                        filterAssignedUsers: e.target.value,
                                      })
                                    }
                                    placeholder="Search Employee"
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                          {assignedUsersDetails &&
                            _.map(assignedUsersDetails, (user, index1) => {
                              return (
                                <div key={user._id}>
                                  {index1 > 0 && <hr />}
                                  <div className="row">
                                    <div className="col-md-3 pb-2 pt-2 assign-name-text">
                                      {(loginRoles.admin ||
                                        loginRoles.projMan) && (
                                        <NavLink
                                          to={`/employee/assignment/${
                                            user._id
                                          }`}
                                        >
                                          {user.profile.fullName}
                                          &nbsp;
                                          <span className="badge badge-pill badge-warning">
                                            {user.profile.posTitle}
                                          </span>
                                        </NavLink>
                                      )}
                                      {!loginRoles.admin &&
                                        !loginRoles.projMan && (
                                          <>
                                            {user.profile.fullName}
                                            &nbsp;
                                            <span className="badge badge-pill badge-warning">
                                              {user.profile.posTitle}
                                            </span>
                                          </>
                                        )}
                                    </div>

                                    <div className="col-md-9 pb-2 pt-2">
                                      {user.inRangeAssignmentsOfUser &&
                                        _.map(
                                          user.inRangeAssignmentsOfUser,
                                          (assignment, index2) => {
                                            return (
                                              <div key={assignment._id}>
                                                {index2 > 0 && <hr />}
                                                <div className="row">
                                                  <div className="col-md-3 assign-name-text">
                                                    {(loginRoles.admin ||
                                                      loginRoles.projMan) && (
                                                      <NavLink
                                                        to={`/project/assignment/${
                                                          assignment._projectId
                                                        }`}
                                                      >
                                                        {assignment.projectName}
                                                      </NavLink>
                                                    )}
                                                    {!loginRoles.admin &&
                                                      !loginRoles.projMan && (
                                                        <>
                                                          {
                                                            assignment.projectName
                                                          }
                                                        </>
                                                      )}
                                                  </div>
                                                  <div className="col-md-3">
                                                    {`${moment(
                                                      assignment.startDate
                                                    ).format(
                                                      'MMM DD, YY'
                                                    )} - ${moment(
                                                      assignment.endDate
                                                    ).format('MMM DD, YY')}`}
                                                  </div>
                                                  <div className="col-md-1">
                                                    <span className="percentage-14-pt1">
                                                      {`${assignment.percent}%`}
                                                    </span>
                                                  </div>
                                                  <div className="col-md-3">
                                                    {assignment.level ===
                                                      'Member' &&
                                                    assignment.role === 'Member'
                                                      ? `${assignment.level}`
                                                      : assignment.level !==
                                                          'Member' &&
                                                        assignment.role !==
                                                          'Member'
                                                      ? `${
                                                          assignment.level
                                                        } & ${assignment.role}`
                                                      : assignment.level !==
                                                        'Member'
                                                      ? `${assignment.level}`
                                                      : assignment.role !==
                                                        'Member'
                                                      ? `${assignment.role}`
                                                      : ''}
                                                  </div>
                                                  <div className="col-md-2">
                                                    {assignment.talents
                                                      ? _.map(
                                                          assignment.talents,
                                                          talent => {
                                                            return (
                                                              <span
                                                                className="react-tagsinput-tag mb-1"
                                                                key={talent}
                                                              >
                                                                {talent}
                                                              </span>
                                                            );
                                                          }
                                                        )
                                                      : ''}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Will Unassign User Cards --> */}
              {/* <div className="col-xs-12 col-sm-12 col-md-12 will-unassign-emp-card">
                <div className="image-flip">
                  <div className="mainflip">
                    <div className="frontside">
                      <div className="card">
                        <div className="card-body">
                          <h1 className="text-center">
                            Employees going to be Unassigned
                          </h1>
                          {aboutToUnassignedEmployeesDetails &&
                            _.map(aboutToUnassignedEmployeesDetails, user => {
                              return (
                                <div className="row" key={user._id}>
                                  <div className="col-md-2 pb-2 pt-2 assign-name-text">
                                    <NavLink
                                      to={`/employee/assignment/${user._id}`}
                                    >
                                      {user.profile.fullName}
                                      &nbsp;
                                      <span className="badge badge-pill badge-warning">
                                        {user.profile.posTitle}
                                      </span>
                                    </NavLink>
                                  </div>
                                  <div className="col-md-2 pb-2 pt-2">
                                    {user.profile.base === 'HCM'
                                      ? 'Ho Chi Minh'
                                      : 'Ha Noi'}
                                  </div>
                                  <div className="col-md-6 pb-2 pt-2">
                                    {user.onBench}
                                  </div>
                                  <div className="col-md-2 pb-2 pt-2">
                                    {user.profile.talents
                                      ? _.map(user.profile.talents, talent => {
                                          return (
                                            <span
                                              className="react-tagsinput-tag"
                                              key={talent}
                                            >
                                              {talent}
                                            </span>
                                          );
                                        })
                                      : ''}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Report.defaultProps = {
  // users: null, remote example (if using ddp)
  users: null,
};

Report.propTypes = {
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
  // const project = _.findWhere(projects, { _id: props.match.params._id });
  const projectsReady = projectsSub.ready() && !!projects;

  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users
    .find({
      $and: [
        { disabled: { $in: [false, null] } },
        { 'profile.country': 'Vietnam' },
      ],
    })
    .fetch();
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
})(Report);
