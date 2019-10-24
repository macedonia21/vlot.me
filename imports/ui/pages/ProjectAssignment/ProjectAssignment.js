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

import './ProjectAssignment.scss';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-notifications/lib/notifications.css';

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

class ProjectAssignment extends React.Component {
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
      },
      reactSelect: {
        employeeIdValue: null,
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
    const { project } = this.props;
    this.setState({
      newAssignment: {
        _employeeId: '',
        _projectId: '',
        startDate: project ? project.startDate : new Date(),
        endDate: project ? project.endDate : new Date(),
        availableDate: project ? project.startDate : new Date(),
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
        employeeIdValue: null,
        percentageValue: this.state.reactSelect.percentageOptions[4],
        levelValue: this.state.reactSelect.levelOptions[0],
        taskRoleValue: this.state.reactSelect.taskRoleOptions[0],
      },
    });
  }

  customFilter(option, searchText) {
    if (
      option.data.profile.fullName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      _.some(
        _.map(option.data.profile.talents, capaTag => {
          return capaTag.toLowerCase().includes(searchText.toLowerCase());
        })
      )
    ) {
      return true;
    }
    return false;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { assignments } = this.props;
    const { newAssignment } = this.state;
    const impactedAssignments = getImpactedAssignments(
      newAssignment,
      assignments
    );
    console.log(impactedAssignments);
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
      users,
      user,
      assignmentsReady,
      assignments,
      projectAssignments,
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

    if (project && !isDefaultSet.set) {
      isDefaultSet.set = true;
      newAssignment._projectId = project._id;
      newAssignment.startDate = project.startDate;
      newAssignment.endDate = project.endDate;
    }

    const activeProjectAssignments = _.sortBy(
      _.sortBy(
        _.sortBy(
          _.filter(projectAssignments, assignment => {
            return _.contains(
              _.map(users, usr => {
                return usr._id;
              }),
              assignment._employeeId
            );
          }),
          assignment3 => {
            return assignment3._employeeId;
          }
        ),
        assignment2 => {
          return moment(assignment2.endDate);
        }
      ),
      assignment1 => {
        return moment(assignment1.startDate);
      }
    );

    const pmUser = user
      ? _.map([user], usr => {
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
            ...usr,
            todayAssignment,
            todayAssignmentProject,
          };
        })[0]
      : null;

    if (activeProjectAssignments) {
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
      const chartDataItems = _.map(activeProjectAssignments, assignment => {
        const assignedUser = _.findWhere(users, {
          _id: assignment._employeeId,
        });
        return [
          assignment._id,
          assignedUser.profile.fullName,
          assignedUser.profile.fullName,
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

      const assignmentChartHeight = (_.size(activeProjectAssignments) + 1) * 40;
      chartData.height < assignmentChartHeight
        ? (chartData.height = assignmentChartHeight)
        : () => null;
    }

    // Selects Component Options
    const assignCurrentlyInProject = _.filter(
      activeProjectAssignments,
      assignment => {
        const currentDateObj = moment();
        const assignEndDateObj = moment(assignment.endDate);
        return assignEndDateObj.isSameOrAfter(currentDateObj, 'day');
      }
    );
    const usersCurrentlyInProject = _.uniq(
      _.map(assignCurrentlyInProject, assignment => assignment._employeeId)
    );
    const userSelectOptions = _.sortBy(
      _.map(
        _.filter(users, usr => {
          return !_.contains(usersCurrentlyInProject, usr._id);
        }),
        user => {
          return {
            value: user._id,
            label: user.profile.fullName,
            profile: user.profile,
          };
        }
      ),
      filterUser => {
        return filterUser.profile.fullName;
      }
    );

    const projectSelectOptions = [
      {
        value: `${project ? project._id : ''}`,
        label: `${project ? project.projectName : ''}`,
      },
    ];

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

    if (!loggedIn) {
      return null;
    }
    return (
      <div className="project-assignment-page">
        <h1 className="mb-4 text-center">
          {projectsReady ? `Project ${project.projectName}` : `Project`}
        </h1>
        <div className="container">
          <div className="row">
            {projectsReady && usersReady && assignmentsReady && (
              <>
                <ProjectCard
                  project={project}
                  key={project._id}
                  isAdmin={loginRoles.admin}
                  isProjMan={loginRoles.projMan}
                />
                {pmUser && (
                  <EmployeeCard
                    user={pmUser}
                    key={pmUser._id}
                    isAdmin={loginRoles.admin}
                    isProjMan={loginRoles.projMan}
                    zindex={2}
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
                                          value={reactSelect.employeeIdValue}
                                          options={userSelectOptions}
                                          placeholder="Select Employee"
                                          onChange={selectedOption => {
                                            this.setState({
                                              newAssignment: {
                                                ...this.state.newAssignment,
                                                _employeeId:
                                                  selectedOption.value,
                                              },
                                              reactSelect: {
                                                ...this.state.reactSelect,
                                                employeeIdValue: selectedOption,
                                              },
                                            });
                                          }}
                                          filterOption={this.customFilter}
                                          styles={reactSelectStyle}
                                          valueKey="value"
                                          labelKey="label"
                                          formatOptionLabel={({
                                            profile,
                                            label,
                                          }) => (
                                            <div
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                              }}
                                            >
                                              {label}
                                              &nbsp;
                                              <span className="badge badge-pill badge-warning">
                                                {profile.posTitle}
                                              </span>
                                            </div>
                                          )}
                                        />
                                      </div>

                                      {/* <!-- Project --> */}
                                      <div className="form-group">
                                        <label htmlFor="projectid">
                                          Project
                                        </label>
                                        <Select
                                          defaultValue={projectSelectOptions[0]}
                                          options={projectSelectOptions}
                                          placeholder="Select Project"
                                          styles={reactSelectStyle}
                                          isDisabled
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
                                          maxTags={3}
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

                                      {/* <!-- Task Role --> */}
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
                <div className="col-xs-12 col-sm-12 col-md-12 project-assignment-card">
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
                                Project Assignments
                              </span>
                            </h1>
                            <div
                              className="collapse"
                              id="collapseProjAssignments"
                            >
                              {_.map(
                                activeProjectAssignments,
                                (assignment, index) => {
                                  const assignedUser = _.findWhere(users, {
                                    _id: assignment._employeeId,
                                  });
                                  return (
                                    <div key={assignment._id}>
                                      {index > 0 && <hr />}
                                      <div className="row">
                                        <div className="col-md-4 pb-2 pt-2 assign-name-text">
                                          <NavLink
                                            to={`/employee/assignment/${
                                              assignedUser._id
                                            }`}
                                          >
                                            {assignedUser.profile.fullName}
                                            &nbsp;
                                            <span className="badge badge-pill badge-warning">
                                              {assignedUser.profile.posTitle}
                                            </span>
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
                            <div className="row" key="0">
                              <div className="col-md-12 pb-2 pt-2">
                                {_.size(activeProjectAssignments) > 0 && (
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
                                    rootProps={{ 'data-testid': '1' }}
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

ProjectAssignment.defaultProps = {
  // users: null, remote example (if using ddp)
  projects: null,
  project: null,
  users: null,
  user: null,
  assignments: null,
  projectAssignments: null,
};

ProjectAssignment.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  projectsReady: PropTypes.bool.isRequired,
  projects: Projects ? PropTypes.array.isRequired : () => null,
  project: PropTypes.object,
  usersReady: PropTypes.bool.isRequired,
  users: Meteor.user() ? PropTypes.array.isRequired : () => null,
  user: PropTypes.object,
  assignmentsReady: PropTypes.bool.isRequired,
  assignments: Assignments ? PropTypes.array : () => null,
  projectAssignments: Assignments ? PropTypes.array : () => null,
};

export default withTracker(props => {
  const projectsSub = Meteor.subscribe('projects.all'); // publication needs to be set on remote server
  const projects = Projects.find({ disabled: { $in: [false, null] } }).fetch();
  const project = _.findWhere(projects, { _id: props.match.params._id });
  const projectsReady = projectsSub.ready() && !!projects;

  const usersSub = Meteor.subscribe('users.all'); // publication needs to be set on remote server
  const users = Meteor.users.find({ disabled: { $in: [false, null] } }).fetch();
  const user = project ? _.findWhere(users, { _id: project._pmId }) : null;
  const usersReady = usersSub.ready() && !!users;

  const assignmentsSub = Meteor.subscribe('assignments.all'); // publication needs to be set on remote server
  const assignments = Assignments.find().fetch();
  const projectAssignments = project
    ? _.where(assignments, { _projectId: project._id })
    : null;
  const assignmentsReady = assignmentsSub.ready() && !!projectAssignments;

  return {
    projectsReady,
    projects,
    project,
    usersReady,
    users,
    user,
    assignmentsReady,
    assignments,
    projectAssignments,
  };
})(ProjectAssignment);
