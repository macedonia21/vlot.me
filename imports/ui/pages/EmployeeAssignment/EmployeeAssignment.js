import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TagsInput from 'react-tagsinput';
import moment from 'moment/moment';
import { Chart } from 'react-google-charts';
import { NotificationManager } from 'react-notifications';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import Select from 'react-select';

// collection
import Projects from '../../../api/projects/projects';
import Assignments from '../../../api/assignments/assignments';

// components
import ProjectCard from '../../components/ProjectCard';
import EmployeeCard from '../../components/EmployeeCard';

import './EmployeeAssignment.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';
import Navbar from '../../components/Navbar/Navbar';

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

function findEmployeeProjectFromAssignments(projects, employeeAssignments) {
  let returnProject = null;

  const currentAssignment = _.find(employeeAssignments, assignment => {
    const startDate = moment(assignment.startDate);
    const endDate = moment(assignment.endDate);
    const currentDate = moment(new Date());
    return (
      startDate.isSameOrBefore(currentDate, 'day') &&
      endDate.isSameOrAfter(currentDate, 'day')
    );
  });

  if (currentAssignment) {
    returnProject = _.findWhere(projects, {
      _id: currentAssignment._projectId,
    });
  }

  return returnProject;
}

function getImpactedAssignments(newAssignment, assignments) {
  const newAssignStartDateObj = moment(newAssignment.startDate);
  const newAssignEndDateObj = moment(newAssignment.endDate);
  return newAssignment.percent === 100
    ? _.map(
        _.filter(assignments, assignment => {
          const assignStartDateObj = moment(assignment.startDate);
          const assignEndDateObj = moment(assignment.endDate);
          return (
            newAssignStartDateObj.isSameOrBefore(assignEndDateObj, 'day') &&
            newAssignEndDateObj.isSameOrAfter(assignStartDateObj, 'day') &&
            newAssignment._employeeId === assignment._employeeId &&
            assignment.percent === 100
          );
        }),
        impactedAssignment => {
          const assignStartDateObj = moment(impactedAssignment.startDate);
          const assignEndDateObj = moment(impactedAssignment.endDate);

          let editFlag = 'U';
          let { startDate } = impactedAssignment;
          let { endDate } = impactedAssignment;

          if (
            newAssignStartDateObj.isSameOrBefore(assignStartDateObj, 'day') &&
            newAssignEndDateObj.isSameOrAfter(assignEndDateObj, 'day')
          ) {
            editFlag = 'D';
          } else if (
            newAssignStartDateObj.isAfter(assignStartDateObj, 'day') &&
            newAssignEndDateObj.isBefore(assignEndDateObj, 'day')
          ) {
          } else if (newAssignStartDateObj.isAfter(assignStartDateObj, 'day')) {
            editFlag = 'U';
            endDate = new Date(newAssignStartDateObj.subtract(1, 'days'));
          } else if (newAssignEndDateObj.isBefore(assignEndDateObj, 'day')) {
            editFlag = 'U';
            startDate = new Date(newAssignEndDateObj.add(1, 'days'));
          } else {
            return null;
          }

          return {
            ...impactedAssignment,
            _id: impactedAssignment._id,
            startDate,
            endDate,
            editFlag,
          };
        }
      )
    : [];
}

class EmployeeAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginRoles: {
        admin: false,
        projMan: false,
      },
      newAssignment: {
        _employeeId: '',
        _projectId: '',
        startDate: new Date(),
        endDate: new Date(),
        availableDate: new Date(),
        percent: 100,
        level: 'Member',
        role: 'Member',
        talents: [],
        remark: '',
      },
      isDefaultSet: {
        set: false,
      },
      chartData: {
        data: {},
        height: 210,
        heightRow: 226,
        calendarData: {},
        calendarHeight: 170,
        calendarHeightRow: 186,
      },
      reactSelect: {
        projectIdValue: null,
        percentageValue: { value: '100', label: '100' },
        percentageOptions: [
          {
            value: 20,
            label: 20,
          },
          {
            value: 40,
            label: 40,
          },
          {
            value: 60,
            label: 60,
          },
          {
            value: 80,
            label: 80,
          },
          {
            value: 100,
            label: 100,
          },
        ],
        levelValue: {
          value: 'Member',
          label: 'Member',
        },
        levelOptions: [
          {
            value: 'Member',
            label: 'Member',
          },
          {
            value: 'Team Lead',
            label: 'Team Lead',
          },
          {
            value: 'Project Manager',
            label: 'Project Manager',
          },
        ],
        taskRoleValue: {
          value: 'Member',
          label: 'Member',
        },
        taskRoleOptions: [
          {
            value: 'Member',
            label: 'Member',
          },
          {
            value: 'Authorization Lead',
            label: 'Authorization Lead',
          },
          {
            value: 'Data Lead',
            label: 'Data Lead',
          },
          {
            value: 'Training Lead',
            label: 'Training Lead',
          },
          {
            value: 'Interface Lead',
            label: 'Interface Lead',
          },
          {
            value: 'Integration Lead',
            label: 'Integration Lead',
          },
          {
            value: 'Technical Lead',
            label: 'Technical Lead',
          },
          {
            value: 'UT Lead',
            label: 'UT Lead',
          },
          {
            value: 'SIT Lead',
            label: 'SIT Lead',
          },
          {
            value: 'UAT Lead',
            label: 'UAT Lead',
          },
          {
            value: 'Cut-over Lead',
            label: 'Cut-over Lead',
          },
        ],
      },
      editingAssignmentId: null,
      editingStartDate: new Date(),
      editingEndDate: new Date(),
      isChanged: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteAssignment = this.handleDeleteAssignment.bind(this);
    this.handleUpdateAssignment = this.handleUpdateAssignment.bind(this);
    this.customFilter = this.customFilter.bind(this);
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

  resetDefaultAssignment() {
    this.setState({
      newAssignment: {
        _employeeId: '',
        _projectId: '',
        startDate: new Date(),
        endDate: new Date(),
        availableDate: new Date(),
        percent: 100,
        level: 'Member',
        role: 'Member',
        talents: [],
        remark: '',
      },
      isDefaultSet: {
        set: false,
      },
      reactSelect: {
        ...this.state.reactSelect,
        projectIdValue: null,
        percentageValue: this.state.reactSelect.percentageOptions[4],
        levelValue: this.state.reactSelect.levelOptions[0],
        taskRoleValue: this.state.reactSelect.taskRoleOptions[0],
      },
    });
  }

  customFilter(option, searchText) {
    if (option.data.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    return false;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { employeeAssignments } = this.props;
    const { newAssignment } = this.state;
    const impactedAssignments = getImpactedAssignments(
      newAssignment,
      employeeAssignments
    );
    Meteor.call(
      'assignment.create',
      newAssignment,
      impactedAssignments,
      (err, res) => {
        if (err) {
          NotificationManager.error(
            `Cannot add: ${err.message}`,
            'Error',
            3000
          );
        } else {
          this.resetDefaultAssignment();
          NotificationManager.success(
            'New assignment is added',
            'Success',
            3000
          );
        }
      }
    );
  }

  handleDeleteAssignment(_id) {
    Meteor.call('assignment.delete', _id, (err, res) => {
      if (err) {
        NotificationManager.error(
          `Cannot delete: ${err.message}`,
          'Error',
          3000
        );
      } else {
        NotificationManager.success('Assignment is deleted', 'Success', 3000);
      }
    });
  }

  handleUpdateAssignment(_id) {
    const { editingStartDate, editingEndDate } = this.state;
    Meteor.call(
      'assignment.update',
      _id,
      editingStartDate,
      editingEndDate,
      (err, res) => {
        if (err) {
          NotificationManager.error(
            `Cannot update: ${err.message}`,
            'Error',
            3000
          );
        } else {
          this.setState({
            editingAssignmentId: null,
            isChanged: false,
          });
          NotificationManager.success('Assignment is updated', 'Success', 3000);
        }
      }
    );
  }

  render() {
    const {
      loggedIn,
      projectsReady,
      projects,
      project,
      usersReady,
      user,
      assignmentsReady,
      employeeAssignments,
    } = this.props;
    const {
      loginRoles,
      newAssignment,
      isDefaultSet,
      chartData,
      reactSelect,
      editingAssignmentId,
      editingStartDate,
      editingEndDate,
      isChanged,
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

    if (user && !isDefaultSet.set) {
      isDefaultSet.set = true;
      newAssignment._employeeId = user._id;
    }

    const selectedUser = _.map([user], user => {
      // Find today Assignment
      const todayAssignment = _.find(employeeAssignments, assignment => {
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
    })[0];

    // Chart Date
    const chartCalendarDataDeclare = [
      { type: 'date', id: 'Date' },
      { type: 'number', id: 'Percent' },
    ];
    let chartCalendarDataItems = [];

    if (employeeAssignments) {
      const chartDataDeclare = [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        {
          type: 'number',
          label: 'Percent Complete',
        },
        {
          type: 'string',
          label: 'Dependencies',
        },
      ];
      const chartDataItems = _.map(employeeAssignments, assignment => {
        const assignedProject = _.findWhere(projects, {
          _id: assignment._projectId,
        });
        return [
          assignment._id,
          assignedProject.projectName,
          assignedProject.projectName,
          assignment.startDate,
          assignment.endDate,
          null,
          assignment.percent,
          null,
        ];
      });
      let chartDataCombine = [];
      chartDataCombine.push(chartDataDeclare);
      chartDataCombine = _.union(chartDataCombine, chartDataItems);
      chartData.data = chartDataCombine;

      const assignmentChartHeight = (_.size(employeeAssignments) + 1) * 40;
      if (chartData.height < assignmentChartHeight) {
        chartData.height = assignmentChartHeight;
        chartData.heightRow = assignmentChartHeight + 16;
      }

      chartCalendarDataItems = _.map(
        _.values(
          _.groupBy(
            _.flatten(
              _.map(employeeAssignments, assignment => {
                const dateRange = getDateRange(
                  assignment.startDate,
                  assignment.endDate
                );
                return _.map(
                  // _.filter(dateRange, day => {
                  //   const runningDay = new Date(
                  //     day.getFullYear(),
                  //     day.getMonth(),
                  //     day.getDate()
                  //   );
                  //   return (
                  //     runningDay.getDay() !== 0 && runningDay.getDay() !== 6
                  //   );
                  // }),
                  dateRange,
                  date => {
                    const runningDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    return [runningDate, assignment.percent];
                  }
                );
              }),
              true
            ),
            item => {
              return item[0];
            }
          )
        ),
        day => {
          return [
            day[0][0],
            _.reduce(
              _.map(day, item => {
                return item[1];
              }),
              (memo, item) => {
                return memo + item;
              },
              0
            ),
          ];
        }
      );
    }

    let chartCalendarDataCombine = [];
    chartCalendarDataCombine.push(chartCalendarDataDeclare);
    if (_.size(chartCalendarDataItems) > 0) {
      chartCalendarDataCombine = _.union(
        chartCalendarDataCombine,
        chartCalendarDataItems
      );
    }

    let assignmentCalendarChartHeight = 170;
    if (_.size(chartCalendarDataItems) > 1) {
      assignmentCalendarChartHeight =
        _.size(
          _.uniq(
            _.map(chartCalendarDataItems, item => {
              return item[0].getFullYear();
            })
          )
        ) *
          150 +
        20;
    }
    chartData.calendarHeight = assignmentCalendarChartHeight;
    chartData.calendarHeightRow = assignmentCalendarChartHeight + 16;
    chartData.calendarData = chartCalendarDataCombine;

    // Selects Component Options
    const userSelectOptions = [
      {
        value: `${user ? user._id : ''}`,
        label: `${user ? user.profile.fullName : ''}`,
      },
    ];

    const projectSelectOptions = _.map(projects, proj => {
      return {
        value: proj._id,
        label: proj.projectName,
      };
    });

    const reactSelectStyle = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isDisabled ? '#e9ecef' : '#fff',
        borderColor: state.isFocused ? '#80bdff' : '#ced4da',
        outline: state.isFocused ? 0 : null,
        boxShadow: state.isFocused
          ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
          : '',
      }),
    };

    return (
      <div className="employee-assignment-page">
        <h1 className="mb-4 text-center">
          {user ? `Assign ${user.profile.fullName}` : `Assign`}
        </h1>
        <div className="container">
          <div className="row">
            {projectsReady && usersReady && assignmentsReady && (
              <>
                <EmployeeCard
                  user={selectedUser}
                  key={selectedUser._id}
                  isAdmin={loginRoles.admin}
                  isProjMan={loginRoles.projMan}
                  zIndex={2}
                />
                {project && (
                  <ProjectCard
                    project={project}
                    key={project._id}
                    isAdmin={loginRoles.admin}
                    isProjMan={loginRoles.projMan}
                  />
                )}

                {loginRoles.admin && (
                  <div className="col-xs-12 col-sm-12 col-md-12 new-assignment-card">
                    <div className="image-flip">
                      <div className="mainflip">
                        <div className="frontside">
                          <div className="card">
                            <div className="card-body">
                              <h1
                                className="card-title text-center dropdown-toggle"
                                data-toggle="collapse"
                                href="#collapseNewAssign"
                                aria-expanded="false"
                                aria-controls="collapseNewAssign"
                              >
                                <span className="title-wrap">
                                  New Assignment
                                </span>
                              </h1>
                              <div className="collapse" id="collapseNewAssign">
                                <form onSubmit={this.handleSubmit}>
                                  <div className="row">
                                    {/* <!-- First Col --> */}
                                    <div className="col-md-4">
                                      {/* <!-- Employee --> */}
                                      <div className="form-group">
                                        <label htmlFor="employeeid">
                                          Employee
                                        </label>
                                        <Select
                                          defaultValue={userSelectOptions[0]}
                                          options={userSelectOptions}
                                          placeholder="Select Employee"
                                          styles={reactSelectStyle}
                                          isDisabled
                                        />
                                      </div>

                                      {/* <!-- Project --> */}
                                      <div className="form-group">
                                        <label htmlFor="projectid">
                                          Project
                                        </label>
                                        <Select
                                          value={reactSelect.projectIdValue}
                                          options={projectSelectOptions}
                                          placeholder="Select Project"
                                          onChange={selectedOption => {
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                _projectId:
                                                  selectedOption.value,
                                              },
                                              reactSelect: {
                                                ...this.state.reactSelect,
                                                projectIdValue: selectedOption,
                                              },
                                            });
                                          }}
                                          filterOption={this.customFilter}
                                          styles={reactSelectStyle}
                                        />
                                      </div>

                                      {/* <!-- Percentage --> */}
                                      <div className="form-group">
                                        <label htmlFor="percent">
                                          Percentage
                                        </label>
                                        <Select
                                          defaultValue={
                                            reactSelect.percentageOptions[4]
                                          }
                                          value={reactSelect.percentageValue}
                                          options={
                                            reactSelect.percentageOptions
                                          }
                                          placeholder="Select Percentage"
                                          onChange={selectedOption => {
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                percent: selectedOption.value,
                                              },
                                              reactSelect: {
                                                ...this.state.reactSelect,
                                                percentageValue: selectedOption,
                                              },
                                            });
                                          }}
                                          styles={reactSelectStyle}
                                          isSearchable={false}
                                        />
                                      </div>
                                    </div>

                                    {/* <!-- Second Col --> */}
                                    <div className="col-md-4">
                                      {/* <!-- Start Date --> */}
                                      <div className="form-group">
                                        <label htmlFor="startdate">
                                          Start Date
                                        </label>
                                        <DatePicker
                                          className="form-control"
                                          selected={newAssignment.startDate}
                                          onChange={date =>
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                startDate: date,
                                                availableDate: date,
                                              },
                                            })
                                          }
                                          maxDate={newAssignment.endDate}
                                          dateFormat="MMM dd, yyyy"
                                        />
                                      </div>

                                      {/* <!-- End Date --> */}
                                      <div className="form-group">
                                        <label htmlFor="enddate">
                                          End Date
                                        </label>
                                        <DatePicker
                                          className="form-control"
                                          selected={newAssignment.endDate}
                                          onChange={date =>
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                endDate: date,
                                              },
                                            })
                                          }
                                          minDate={newAssignment.startDate}
                                          dateFormat="MMM dd, yyyy"
                                        />
                                      </div>

                                      {/* <!-- Talents --> */}
                                      <div className="form-group">
                                        <label htmlFor="talents">
                                          Capabilities
                                        </label>
                                        <TagsInput
                                          id="talents"
                                          className="form-control"
                                          value={newAssignment.talents}
                                          maxTags={4}
                                          onChange={tags =>
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                talents: tags,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* <!-- Third Col --> */}
                                    <div className="col-md-4">
                                      {/* <!-- Level --> */}
                                      <div className="form-group">
                                        <label htmlFor="level">Level</label>
                                        <Select
                                          defaultValue={
                                            reactSelect.levelOptions[0]
                                          }
                                          value={reactSelect.levelValue}
                                          options={reactSelect.levelOptions}
                                          placeholder="Select Level"
                                          onChange={selectedOption => {
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                level: selectedOption.value,
                                              },
                                              reactSelect: {
                                                ...this.state.reactSelect,
                                                levelValue: selectedOption,
                                              },
                                            });
                                          }}
                                          styles={reactSelectStyle}
                                          isSearchable={false}
                                        />
                                      </div>

                                      {/* <!-- Role --> */}
                                      <div className="form-group">
                                        <label htmlFor="role">Task Role</label>
                                        <Select
                                          defaultValue={
                                            reactSelect.taskRoleOptions[0]
                                          }
                                          value={reactSelect.taskRoleValue}
                                          options={reactSelect.taskRoleOptions}
                                          placeholder="Select Task Role"
                                          onChange={selectedOption => {
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                role: selectedOption.value,
                                              },
                                              reactSelect: {
                                                ...this.state.reactSelect,
                                                taskRoleValue: selectedOption,
                                              },
                                            });
                                          }}
                                          styles={reactSelectStyle}
                                          isSearchable={false}
                                        />
                                      </div>

                                      {/* <!-- Remark --> */}
                                      <div className="form-group">
                                        <label htmlFor="remark">Remark</label>
                                        <input
                                          id="remark"
                                          type="text"
                                          className="form-control"
                                          name="remark"
                                          value={newAssignment.remark || ''}
                                          onChange={e =>
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                remark: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="form-group no-margin">
                                    <button
                                      type="submit"
                                      className="btn btn-primary btn-block mb-2"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* <!-- Employee Assignments --> */}
                <div className="col-xs-12 col-sm-12 col-md-12 employee-assignment-card">
                  <div className="image-flip">
                    <div className="mainflip">
                      <div className="frontside">
                        <div className="card">
                          <div className="card-body">
                            <h1
                              className="card-title text-center dropdown-toggle"
                              data-toggle="collapse"
                              href="#collapseProjAssignments"
                              aria-expanded="false"
                              aria-controls="collapseProjAssignments"
                            >
                              <span className="title-wrap">
                                Employee Assignments
                              </span>
                            </h1>
                            <div
                              className="collapse"
                              id="collapseProjAssignments"
                            >
                              {_.map(
                                employeeAssignments,
                                (assignment, index) => {
                                  const assignedProject = _.findWhere(
                                    projects,
                                    {
                                      _id: assignment._projectId,
                                    }
                                  );
                                  return (
                                    <div key={assignment._id}>
                                      {index > 0 && <hr />}
                                      <div className="row">
                                        <div className="col-md-4 pb-2 pt-2 assign-name-text">
                                          <NavLink
                                            to={`/project/assignment/${
                                              assignedProject._id
                                            }`}
                                          >
                                            {assignedProject.projectName}
                                          </NavLink>
                                        </div>

                                        {assignment._id ===
                                        editingAssignmentId ? (
                                          <>
                                            <div
                                              className="col-md-7 pb-1 pt-1"
                                              style={{ minHeight: '33px' }}
                                            >
                                              <form className="form-inline">
                                                <label htmlFor="startdate">
                                                  Start Date
                                                </label>
                                                <DatePicker
                                                  className="form-control assignment-edit-input ml-sm-2 mr-sm-2"
                                                  selected={editingStartDate}
                                                  onChange={date =>
                                                    this.setState({
                                                      isChanged: true,
                                                      editingStartDate: date,
                                                    })
                                                  }
                                                  maxDate={editingEndDate}
                                                  dateFormat="MMM dd, yyyy"
                                                />
                                                <label htmlFor="enddate">
                                                  End Date
                                                </label>
                                                <DatePicker
                                                  className="form-control assignment-edit-input ml-sm-2 mr-sm-2"
                                                  selected={editingEndDate}
                                                  onChange={date =>
                                                    this.setState({
                                                      isChanged: true,
                                                      editingEndDate: date,
                                                    })
                                                  }
                                                  minDate={editingStartDate}
                                                  dateFormat="MMM dd, yyyy"
                                                />
                                              </form>
                                            </div>
                                            <div className="col-md-1 pb-2 pt-2">
                                              <button
                                                type="button"
                                                className="btn btn-sm assignment-small-button mr-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Save"
                                                onClick={() => {
                                                  this.handleUpdateAssignment(
                                                    assignment._id
                                                  );
                                                }}
                                                disabled={!isChanged}
                                              >
                                                <span className="fa fa-check text-primary" />
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-sm assignment-small-button"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Cancel"
                                                onClick={() => {
                                                  this.setState({
                                                    editingAssignmentId: null,
                                                    isChanged: false,
                                                  });
                                                }}
                                              >
                                                <span className="fa fa-times text-secondary" />
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="col-md-2 pb-2 pt-2 assign-date-14-mt2">
                                              {`${moment(
                                                assignment.startDate
                                              ).format(
                                                'MMM DD, YY'
                                              )} - ${moment(
                                                assignment.endDate
                                              ).format('MMM DD, YY')}`}
                                            </div>
                                            <div className="col-md-1 pb-2 pt-2">
                                              {`${assignment.percent}%`}
                                            </div>
                                            <div className="col-md-2 pb-2 pt-2">
                                              {assignment.level === 'Member' &&
                                              assignment.role === 'Member'
                                                ? `${assignment.level}`
                                                : assignment.level !==
                                                    'Member' &&
                                                  assignment.role !== 'Member'
                                                ? `${assignment.level} & ${
                                                    assignment.role
                                                  }`
                                                : assignment.level !== 'Member'
                                                ? `${assignment.level}`
                                                : assignment.role !== 'Member'
                                                ? `${assignment.role}`
                                                : ''}
                                            </div>
                                            <div className="col-md-2 pb-2 pt-2">
                                              {assignment.talents
                                                ? _.map(
                                                    assignment.talents,
                                                    talent => {
                                                      return (
                                                        <span
                                                          className="react-tagsinput-tag"
                                                          key={talent}
                                                        >
                                                          {talent}
                                                        </span>
                                                      );
                                                    }
                                                  )
                                                : ''}
                                            </div>
                                            <div className="col-md-1 pb-2 pt-2">
                                              {loginRoles.admin && (
                                                <>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm assignment-small-button mr-2"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Edit"
                                                    onClick={() => {
                                                      this.setState({
                                                        editingAssignmentId:
                                                          assignment._id,
                                                        editingStartDate:
                                                          assignment.startDate,
                                                        editingEndDate:
                                                          assignment.endDate,
                                                      });
                                                    }}
                                                  >
                                                    <span className="fa fa-calendar-o text-primary" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm assignment-small-button"
                                                    data-toggle="tooltip"
                                                    data-placement="top"
                                                    title="Delete"
                                                    onClick={() =>
                                                      this.handleDeleteAssignment(
                                                        assignment._id
                                                      )
                                                    }
                                                  >
                                                    <span className="fa fa-trash-o text-danger" />
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div
                              className="row"
                              key="0"
                              style={{ height: chartData.calendarHeightRow }}
                            >
                              <div className="col-md-12 pb-2 pt-2">
                                <Chart
                                  width="auto"
                                  height={`${chartData.calendarHeight}px`}
                                  chartType="Calendar"
                                  loader={<div>Chart loading...</div>}
                                  data={chartData.calendarData}
                                  options={{
                                    title: 'Employee Calendar',
                                    calendar: {
                                      yearLabel: {
                                        fontName: 'Roboto',
                                      },
                                      dayOfWeekLabel: {
                                        fontName: 'Roboto',
                                      },
                                      monthLabel: {
                                        fontName: 'Roboto',
                                      },
                                    },
                                    colorAxis: { minValue: 0 },
                                  }}
                                  rootProps={{ 'data-testid': '1' }}
                                />
                              </div>
                            </div>
                            <div
                              className="row"
                              key="1"
                              style={{ height: chartData.heightRow }}
                            >
                              <div className="col-md-12 pb-2 pt-2">
                                {_.size(employeeAssignments) > 0 && (
                                  <Chart
                                    width="100%"
                                    height={`${chartData.height}px`}
                                    chartType="Gantt"
                                    loader={<div>Chart loading...</div>}
                                    data={chartData.data}
                                    options={{
                                      height: chartData.height,
                                      gantt: {
                                        trackHeight: 40,
                                        labelStyle: {
                                          fontName: 'Nunito-Bold',
                                        },
                                      },
                                    }}
                                    rootProps={{ 'data-testid': '2' }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

EmployeeAssignment.defaultProps = {
  // users: null, remote example (if using ddp)
  projects: null,
  project: null,
  user: null,
  employeeAssignments: null,
};

EmployeeAssignment.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  projectsReady: PropTypes.bool.isRequired,
  projects: Projects ? PropTypes.array.isRequired : () => null,
  project: PropTypes.object,
  usersReady: PropTypes.bool.isRequired,
  user: PropTypes.object,
  assignmentsReady: PropTypes.bool.isRequired,
  employeeAssignments: Assignments ? PropTypes.array : () => null,
};

export default withTracker(props => {
  const projectsSub = Meteor.subscribe('projects.all'); // publication needs to be set on remote server
  const projects = Projects.find({ disabled: { $in: [false, null] } }).fetch();
  const projectsReady = projectsSub.ready() && !!projects;

  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find({ disabled: { $in: [false, null] } }).fetch();
  const user = _.findWhere(users, { _id: props.match.params._id });
  const usersReady = usersSub.ready() && !!users;

  const assignmentsSub = Meteor.subscribe('assignments.all'); // publication needs to be set on remote server
  const assignments = Assignments.find().fetch();
  const employeeAssignments = user
    ? _.sortBy(
        _.sortBy(
          _.where(assignments, { _employeeId: user._id }),
          assignment2 => {
            return moment(assignment2.endDate);
          }
        ),
        assignment1 => {
          return moment(assignment1.startDate);
        }
      )
    : null;
  const project =
    projectsReady && employeeAssignments
      ? findEmployeeProjectFromAssignments(projects, employeeAssignments)
      : null;
  const assignmentsReady = assignmentsSub.ready() && !!employeeAssignments;

  return {
    projectsReady,
    projects,
    project,
    usersReady,
    user,
    assignmentsReady,
    employeeAssignments,
  };
})(EmployeeAssignment);
