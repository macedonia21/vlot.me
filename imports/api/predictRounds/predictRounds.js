import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Collection definition
export const PredictRounds = new Mongo.Collection('predictRounds');

export default PredictRounds;
