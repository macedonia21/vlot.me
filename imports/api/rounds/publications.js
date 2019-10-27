import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Rounds from './rounds.js';

if (Meteor.isServer) {
  // This code only runs on the server
  // Admin
  Meteor.publish('rounds', function roundsPublication() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      return Rounds.find(
        {},
        {
          sort: { index: -1 },
        }
      );
    }

    return this.ready();
  });
  // Users
  Meteor.publish('rounds50Latest', function roundsPublication() {
    return Rounds.find(
      {},
      {
        sort: { index: -1 },
        limit: 50,
      }
    );
  });
  Meteor.publish('rounds60Days', function roundsPublication() {
    return Rounds.find(
      {
        regISODate: {
          $gte: new Date(moment(new Date()).subtract(59, 'days')),
        },
      },
      {
        sort: { index: -1 },
      }
    );
  });
  Meteor.publish('roundsPaging', function roundsPublication(limit) {
    return Rounds.find(
      {},
      {
        sort: { index: -1 },
        limit,
      }
    );
  });
  Meteor.publish('roundsSkipCount', function roundsPublication(limit) {
    return Rounds.find(
      {},
      {
        fields: {
          skipCount: 1,
        },
        sort: { index: -1 },
        limit,
      }
    );
  });
  Meteor.publish('roundsAllFrequence', function roundsPublication(limit) {
    return Rounds.find(
      {},
      {
        fields: {
          allFrequence: 1,
          pos1Frequence: 1,
          pos2Frequence: 1,
          pos3Frequence: 1,
          pos4Frequence: 1,
          pos5Frequence: 1,
          pos6Frequence: 1,
        },
        sort: { index: -1 },
        limit,
      }
    );
  });
  Meteor.publish('roundsPosFrequence', function roundsPublication(limit) {
    return Rounds.find(
      {},
      {
        fields: {
          pos1Frequence: 1,
          pos2Frequence: 1,
          pos3Frequence: 1,
          pos4Frequence: 1,
          pos5Frequence: 1,
          pos6Frequence: 1,
        },
        sort: { index: -1 },
        limit,
      }
    );
  });
  Meteor.publish('statisticRate', function roundsPublication(limit) {
    return Rounds.find(
      {},
      {
        fields: {
          index: 1,
          statisticRate: 1,
        },
        sort: { index: -1 },
        limit,
      }
    );
  });
}
