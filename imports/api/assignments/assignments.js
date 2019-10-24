// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Assignments = new Mongo.Collection('assignments');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  _employeeId: {
    type: String,
  },
  _projectId: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  availableDate: {
    type: Date,
  },
  percent: {
    type: Number,
  },
  level: {
    type: String,
  },
  role: {
    type: String,
  },
  talents: {
    type: Array,
  },
  'talents.$': { type: String },
  remark: {
    type: String,
    optional: true,
  },
});

// attach schema
Assignments.attachSchema(Schema);

export default Assignments;
