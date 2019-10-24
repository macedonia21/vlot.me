import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import Projects from './projects/projects.js';
import Assignments from './assignments/assignments.js';

if (Meteor.isServer) {
  Meteor.methods({
    'employee.create'(email, password, profile, disabled, roles) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(email, String);
      check(password, String);
      check(profile, {
        firstName: String,
        lastName: String,
        vnName: String,
        entCode: String,
        country: String,
        joinDate: Date,
        base: String,
        empType: String,
        indicator: String,
        indAlignment: String,
        costCenter: String,
        portfolios: String,
        offering: String,
        posTitle: String,
        jobLevel: String,
        gender: String,
        talents: Match.Maybe([String]),
        hPW: Number,
        _counsellorId: String,
      });
      check(disabled, Boolean);
      check(roles, {
        admin: Boolean,
        projMan: Boolean,
      });

      try {
        const _id = Accounts.createUser({
          email,
          password,
          profile,
          disabled,
        });
        if (_id) {
          Roles.addUsersToRoles(_id, ['user'], Roles.GLOBAL_GROUP);

          if (roles.admin) {
            Roles.addUsersToRoles(_id, ['admin'], Roles.GLOBAL_GROUP);
          }

          if (roles.projMan) {
            Roles.addUsersToRoles(_id, ['projman'], Roles.GLOBAL_GROUP);
          }
        }
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'employee.update'(_id, profile, disabled, roles) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(_id, String);
      check(profile, {
        firstName: String,
        lastName: String,
        fullName: String,
        vnName: String,
        entCode: String,
        country: String,
        joinDate: Date,
        base: String,
        empType: String,
        indicator: String,
        indAlignment: String,
        costCenter: String,
        portfolios: String,
        offering: String,
        posTitle: String,
        jobLevel: String,
        gender: String,
        talents: Match.Maybe([String]),
        email: String,
        hPW: Number,
        _counsellorId: String,
        avatar: Match.Maybe(String),
      });
      check(disabled, Match.Maybe(Boolean));
      check(roles, {
        admin: Boolean,
        projMan: Boolean,
      });

      try {
        Meteor.users.update(
          { _id },
          {
            $set: {
              'profile.firstName': profile.firstName,
              'profile.lastName': profile.lastName,
              'profile.fullName': `${profile.firstName} ${profile.lastName}`,
              'profile.vnName': profile.vnName,
              'profile.entCode': profile.entCode,
              'profile.country': profile.country,
              'profile.joinDate': profile.joinDate,
              'profile.base': profile.base,
              'profile.empType': profile.empType,
              'profile.costCenter': profile.costCenter,
              'profile.portfolios': profile.portfolios,
              'profile.offering': profile.offering,
              'profile.posTitle': profile.posTitle,
              'profile.jobLevel': profile.jobLevel,
              'profile.gender': profile.gender,
              'profile.talents': profile.talents,
              'profile.hPW': profile.hPW,
              'profile.avatar': profile.avatar,
              disabled,
            },
          }
        );

        if (roles.admin) {
          Roles.addUsersToRoles(_id, ['admin'], Roles.GLOBAL_GROUP);
        } else {
          Roles.removeUsersFromRoles(_id, ['admin'], Roles.GLOBAL_GROUP);
        }

        if (roles.projMan) {
          Roles.addUsersToRoles(_id, ['projman'], Roles.GLOBAL_GROUP);
        } else {
          Roles.removeUsersFromRoles(_id, ['projman'], Roles.GLOBAL_GROUP);
        }
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'employee.setPassword'(userId, newPassword) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(userId, String);
      check(newPassword, String);

      try {
        Accounts.setPassword(userId, newPassword);
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'project.create'(project) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(project, {
        projectName: String,
        engagementCode: String,
        _pmId: Match.Maybe(String),
        startDate: Date,
        endDate: Date,
        status: String,
        remark: String,
        disabled: Boolean,
      });

      try {
        Projects.insert(project);
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'project.update'(_id, project) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(_id, String);
      check(project, {
        _id: String,
        projectName: String,
        engagementCode: String,
        _pmId: Match.Maybe(String),
        startDate: Date,
        endDate: Date,
        status: String,
        remark: Match.Maybe(String),
        disabled: Match.Maybe(Boolean),
      });

      try {
        Projects.update(
          { _id },
          {
            $set: {
              projectName: project.projectName,
              engagementCode: project.engagementCode,
              _pmId: project._pmId,
              startDate: project.startDate,
              endDate: project.endDate,
              status: project.status,
              remark: project.remark,
              disabled: project.disabled,
            },
          }
        );
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'assignment.create'(assignment, impactedAssignments) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(assignment, {
        _employeeId: String,
        _projectId: String,
        startDate: Date,
        endDate: Date,
        availableDate: Date,
        percent: Number,
        level: String,
        role: String,
        talents: Match.Maybe([String]),
        remark: String,
      });

      check(
        impactedAssignments,
        Match.Where(impactedAssignments => {
          _.each(impactedAssignments, eachAssignment => {
            check(
              eachAssignment,
              Match.Maybe({
                _id: Match.Maybe(String),
                _employeeId: String,
                _projectId: String,
                startDate: Date,
                endDate: Date,
                availableDate: Date,
                percent: Number,
                level: String,
                role: String,
                talents: Match.Maybe([String]),
                remark: Match.Maybe(String),
                editFlag: String,
              })
            );
          });
          return true;
        })
      );

      try {
        Assignments.insert(assignment);

        _.each(impactedAssignments, impactedAssignment => {
          if (impactedAssignment.editFlag === 'I') {
            Assignments.insert(impactedAssignment);
          } else if (impactedAssignment.editFlag === 'U') {
            Assignments.update(
              { _id: impactedAssignment._id },
              {
                $set: {
                  startDate: impactedAssignment.startDate,
                  endDate: impactedAssignment.endDate,
                },
              }
            );
          } else if (impactedAssignment.editFlag === 'D') {
            Assignments.remove({
              _id: impactedAssignment._id,
            });
          }
        });
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'assignment.delete'(_id) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(_id, String);

      try {
        Assignments.remove({
          _id,
        });
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
    'assignment.update'(_id, startDate, endDate) {
      if (
        !Roles.userIsInRole(Meteor.userId(), 'superadmin') &&
        !Roles.userIsInRole(Meteor.userId(), 'admin')
      ) {
        throw new Meteor.Error('Not authorized');
      }

      check(_id, String);
      check(startDate, Date);
      check(endDate, Date);

      try {
        Assignments.update(
          { _id },
          {
            $set: {
              startDate,
              endDate,
              availableDate: startDate,
            },
          }
        );
      } catch (e) {
        throw new Meteor.Error(e.message);
      }
    },
  });
}
