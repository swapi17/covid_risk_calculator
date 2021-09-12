'use strict';

//Require Package Modules
var mongoose = require('mongoose');
var _ = require('lodash');
var deleteKey = require('key-del');
var xlsx = require('xlsx');
var async = require('async');
var config = require('meanio').loadConfig();
var moment = require('moment');
var chalk = require('chalk')

//Require Mongoose Models

var CovidUser = mongoose.model('CovidUser');

exports.registerUser = function (req, res) {

   let payload  = {};
   payload.name  = req.name;
   payload.phone = req.phone;
   payload.pincode = req.pincode;
   payload.role = req.role;
   let user = new CovidUser(payload);
   CovidUser.save((err, user) => {
            if (err) {
                return res.status(500).json(err);
            } else if (!user) {
                return res.status(400).json({ 'msg': 'err creating user' });
            }

            return res.status(200).json(user);
        });
}

exports.selfAssessment = function (req, res) {

   let selfAssessmentOfUser = {};
   selfAssessmentOfUser.symptoms = req.body.symptoms;
   selfAssessmentOfUser.travelHistory = req.body.travelHistory; 
   selfAssessmentOfUser.contactWithCovidPatient = req.body.contactWithCovidPatient;
   let riskPercentage = 0;
    if(selfAssessmentOfUser.symptoms.lenth === 0 && 
            !selfAssessmentOfUser.travelHistory &&
            !selfAssessmentOfUser.contactWithCovidPatient){
                riskPercentage = 5;
    }else if (selfAssessmentOfUser.symptoms.lenth !== 0  ||
            selfAssessmentOfUser.travelHistory ||
            selfAssessmentOfUser.contactWithCovidPatient) {
                 if(selfAssessmentOfUser.symptoms.lenth == 1){
                   riskPercentage = 50;
                 }else if (selfAssessmentOfUser.symptoms.lenth === 2){
                   riskPercentage = 75;
                 }else{
                    riskPercentage = 95;
                 }
                 
    };
    selfAssessmentOfUser.risk = riskPercentage;
    CovidUser.findOneAndUpdate({userId: req.body.userId},{$push:{selfAssessment: selfAssessmentOfUser}},(err, user) => {
            if (err) {
                return res.status(500).json(err);
            } else if (!user) {
                return res.status(404).json({ 'msg': 'Sorry, the user doesnot exist!' });
            }
            
            return res.status(200).json({"riskPercentage": user.risk});
    });
}

exports.updateCovidResult = function (req, res) {
   let covidResultOfUser = {};
   covidResultOfUser.result = req.body.result;
   covidResultOfUser.updatedBy = req.body.adminId;
   CovidUser.findOneAndUpdate({userId: req.body.userId},{$set:{covidResult: covidResultOfUser}},(err, user) => {
            if (err) {
                return res.status(500).json(err);
            } else if (!user) {
                return res.status(404).json({ 'msg': 'Sorry, the user doesnot exist!' });
            }
            
            return res.status(200).json({"updated": true});
    });
}

exports.getZoneInfo = function (req, res) {
   let zoneInfo = {numCases: 0, zoneType: "GREEN"};
   let query = {};
   query.pincode = req.body.pincode;
   query.result = 'positive';
   CovidUser.count(query, function(err, userCount){
        if(userCount < 5){
           zoneInfo.numCases = userCount;
           zoneInfo.zoneType = "ORANGE";
        }else if (userCount > 5){
            zoneInfo.numCases = userCount;
           zoneInfo.zoneType = "RED";
        }
     return res.status(200).json(zoneInfo);
   });

   
   
}