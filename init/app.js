const mongoose = require('mongoose');
const User = require('../models/user'); 
const passportLocalMongoose = require('passport-local-mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/griffin"; 


mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Create dummy data
const createDummyUser = async () => {
    try {
        // Example data
        const dummyUser = {
            username: 'john_doe',
            email: 'john.doe@example.com',
            password: 'password123',
            fullName: 'John Doe',
            dateOfBirth: new Date('1990-01-01'),
            gender: 'Male',
            phoneNumber: '1234567890',
            address: {
                street: '123 Elm St',
                city: 'Springfield',
                state: 'IL',
                postalCode: '62701',
                country: 'USA'
            },
            emergencyContact: {
                name: 'Jane Doe',
                relationship: 'Sister',
                phoneNumber: '0987654321'
            },
            rehabilitationHistory: [
                {
                    diagnosis: 'Back Pain',
                    treatmentPlan: 'Physical Therapy',
                    startDate: new Date('2023-01-01'),
                    endDate: new Date('2023-06-01'),
                    therapist: null,  // You can add a valid ObjectId here if needed
                    sessionNotes: 'Initial assessment completed.',
                    progress: {
                        physical: 'Good',
                        mental: 'Stable',
                        emotional: 'Stable'
                    }
                }
            ],
            appointments: [
                {
                    date: new Date('2023-09-15'),
                    time: '10:00 AM',
                    type: 'Consultation',
                    staffAssigned: null,  // You can add a valid ObjectId here if needed
                    status: 'Scheduled',
                    notes: 'Consultation with the specialist.'
                }
            ],
            medicalConditions: {
                allergies: ['Penicillin'],
                medications: [
                    {
                        name: 'Ibuprofen',
                        dosage: '200mg',
                        frequency: 'Twice a day'
                    }
                ],
                preExistingConditions: ['Hypertension'],
                currentHealthStatus: {
                    height: 180,  // In centimeters
                    weight: 75,   // In kilograms
                    bloodPressure: '120/80',
                    heartRate: 72
                }
            },
            staffDetails: null,  // This is for staff members, set to null for non-staff users
            notifications: [
                {
                    message: 'Your appointment is scheduled for September 15.',
                    date: new Date(),
                    read: false
                }
            ],
            profileImage: 'path/to/image.jpg',
            isActive: true,
            supportGroups: [
                {
                    groupName: 'Back Pain Support Group',
                    joinDate: new Date()
                }
            ]
        };

        // Create a new user
        const newUser = new User(dummyUser);

        // Register the user
        await User.register(newUser, 'password123');
        console.log('Dummy user created successfully');
    } catch (err) {
        console.error('Error creating dummy user:', err);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

// Run the dummy data creation
createDummyUser();
