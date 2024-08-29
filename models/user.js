const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  emergencyContact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
  },
  rehabilitationHistory: [
    {
      diagnosis: { type: String, required: true },
      treatmentPlan: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      therapist: { type: Schema.Types.ObjectId, ref: 'User' },  // Reference to a therapist
      sessionNotes: { type: String },
      progress: {
        physical: { type: String },  // Example: "Good", "Moderate", "Poor"
        mental: { type: String },
        emotional: { type: String },
      },
    },
  ],
  appointments: [
    {
      date: { type: Date, required: true },
      time: { type: String, required: true },
      type: {
        type: String,
        enum: ['Consultation', 'Therapy Session', 'Follow-Up', 'Assessment'],
        required: true,
      },
      staffAssigned: { type: Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
      },
      notes: { type: String },
    },
  ],
  medicalConditions: {
    allergies: [String],
    medications: [
      {
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String },
      },
    ],
    preExistingConditions: [String],
    currentHealthStatus: {
      height: { type: Number },  // In centimeters
      weight: { type: Number },  // In kilograms
      bloodPressure: { type: String },
      heartRate: { type: Number },
    },
  },
  staffDetails: {  // Specific to staff members
    department: { type: String },  // E.g., "Physiotherapy", "Counseling"
    designation: { type: String },  // E.g., "Therapist", "Doctor"
    qualifications: [String],
    yearsOfExperience: { type: Number },
    availability: [
      {
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
  },
  
  notifications: [
    {
      message: { type: String },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],
  profileImage: {
    type: String,
  },
  isActive: {  // To manage the user's active or inactive status
    type: Boolean,
    default: true,
  },
  supportGroups: [  // List of support groups the user is a member of
    {
      groupName: { type: String, required: true },
      joinDate: { type: Date, default: Date.now },
     
    },
  ],
});

// Plugin Configuration for passport-local-mongoose
const options = {
  usernameField: 'username',
  errorMessages: {
    IncorrectPasswordError: 'Password is incorrect',
    IncorrectUsernameError: 'Username does not exist',
    MissingUsernameError: 'Please provide a username',
    MissingPasswordError: 'Please provide a password',
  },
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', userSchema);
