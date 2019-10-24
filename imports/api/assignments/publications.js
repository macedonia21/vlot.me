// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Assignments from './assignments.js';

if (Meteor.isServer) {
  Meteor.publish('assignments.all', function() {
    if (Roles.userIsInRole(this.userId, ['admin', 'projman', 'user'])) {
      return Assignments.find();
    }
    return this.ready();
  });
}
