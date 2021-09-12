'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');


var CovidUserSchema = new Schema({
    name: {
        type: String,
        required: true,
        get: escapeProperty
    },
    phone: {
        type: String
        maxLength:  10
    },
    pinCode: {
        type: String,
    },
    selfAssessment: [{
        symptoms: {
            type: Array,
            enum: ['cough','cold','fever'],
        },
        travelHistory: {
            type: Boolean
        },
        contactWithCovidPatient: {
            type: Boolean
        }
    }],
    risk: {
        type: Number
      },
     roles: {
        type: String,
        enum: ['user','admin']
     },
     covidTestResult: {
      result: {
        type: String,
        enum: ['positive','negative','pending'] 
      },
      updatedBy: {
        type: mongoose.Types.ObjectId
        }
     }, 
     healthStatus: {
         type: String
     }
    }
});




mongoose.model('covidUser', CovidUserSchema);
