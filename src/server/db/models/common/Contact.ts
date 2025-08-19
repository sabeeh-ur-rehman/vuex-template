import { Schema } from 'mongoose';

export const ContactSchema = new Schema({
  nameFirst: { type: String, trim: true },
  nameLast:  { type: String, trim: true },

  email1:    { type: String, trim: true, lowercase: true },
  email1Notify: { type: Boolean, default: true },
  email2:    { type: String, trim: true, lowercase: true },
  email2Notify: { type: Boolean, default: false },

  mobile1:   { type: String, trim: true },
  mobile1Notify: { type: Boolean, default: true },
  mobile2:   { type: String, trim: true },
  mobile2Notify: { type: Boolean, default: false },

  homePhone: { type: String, trim: true },
  workPhone: { type: String, trim: true },

  postal:       { type: String, trim: true },
  postLocality: { type: String, trim: true },
  directions:   { type: String, trim: true },

  acn:              { type: String, trim: true },
  contractorLicNo:  { type: String, trim: true }
}, { _id: false });

export default ContactSchema;
