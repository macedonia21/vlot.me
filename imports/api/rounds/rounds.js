import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Collection definition
export const Rounds = new Mongo.Collection('rounds');
export const RoundsSkipCount = new Mongo.Collection('roundsSkipCount');

export default Rounds;