"use strict";

const mongoose = require('mongoose');
const async = require('async');
const utils = require('./mongo-util');
const should = require('should');
const TestModel = require('./TestModel')



//Data for test models
let optA = {
    name: 'testA',
    rating: 1200
};

let optB = {
    name: 'testB',
    rating: 1400
};

describe('Plugin fields and functions', () => {

    it('should have a rating number field', function(done) {
        TestModel.create(optA, (err, model) => {
            should.not.exist(err);
            model.rating.should.equal(1200);
            model.rating.should.be.Number();
            done();
        });
    });

    it('should have an updateRatings function', (done) => {
        TestModel.updateRatings.should.be.Function();
        done();
    });

});

describe('Functionality', () => {

    it('should update ratings properly', function(done) {
        TestModel.create(optA, (err, a) => {
            TestModel.create(optB, (err, b) => {
                TestModel.updateRatings(a.id, b.id, function(err, models) {
                    should.not.exist(err);

                    const expectedWinnerOutcome = 1224;
                    const expectedLoserOutcome = 1376;
    
                    models[0].rating.should.not.equal(optA.rating);
                    models[1].rating.should.not.equal(optB.rating);

                    models[0].rating.should.equal(expectedWinnerOutcome);
                    models[1].rating.should.equal(expectedLoserOutcome);
                    done();
                });
            });
        });
    });


    it('should throw an error if ids are the same', function(done) {
        TestModel.create(optA, (err, a) => {
            should.not.exist(err);
            TestModel.updateRatings(a.id, a.id, function(err, models) {
                should.exist(err);
                err.should.be.Error();
                err.message.should.equal('Ids cannot be the same');
                done()
            });
        });
    });

    it('should throw an error if winner model not found', function(done) {
        TestModel.create(optA, (err, m) => {
            TestModel.updateRatings(null, m.id, (err, models) => {
                should.exist(err);
                err.message.should.equal('Winner model not found');
                done();
            });
        });
    });

    it('should throw an error if loser model not found', function(done) {
        TestModel.create(optA, (err, m) => {
            TestModel.updateRatings(m.id, null, (err, models) => {
                should.exist(err);
                err.message.should.equal('Loser model not found');
                done();
            });
        });
    });

    it('should sort by rating', function(done) {
        async.map([optA, optB], (item, cb) => {
            TestModel.create(item, (err, m) => {
                cb(null, m);
            });
        }, (err, models) => {
            TestModel.sortByRating((err, model) => {
                model[0].rating.should.equal(1400);
                model[1].rating.should.equal(1200);
                done();

            });
        });

    });

    it('should allow chainable queries sorted by rating', function(done) {
        async.map([optA, optB], (item, cb) => {
            TestModel.create(item, (err, m) => {
                cb(null, m);
            });
        }, (err, models) => {

            TestModel.sortByRating()
                     .find({name:'testA'})
                     .exec((err, model) => {
                         model.length.should.equal(1);
                         model[0].name.should.equal('testA');
                         done();
                     });
        });
    });
});
