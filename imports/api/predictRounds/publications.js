import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment';
import PredictRounds from './predictRounds.js';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('predictRounds2Latest', function roundsPublication() {
    return PredictRounds.find(
      {},
      {
        sort: { index: -1 },
        limit: 2,
      }
    );
  });
  Meteor.publish('maxPredictRoundIndex', function roundsPublication() {
    return PredictRounds.find(
      {},
      {
        fields: {
          index: 1,
        },
        sort: { index: -1 },
        limit: 1,
      }
    );
  });
}
