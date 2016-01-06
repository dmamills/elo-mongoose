"use strict";
const elorank = require('elo-rank');

/**
*   Elo ranking plugin for mongoose
*/
module.exports = (schema, options) => {

    let elo = elorank();

    // Add the rating field to the schema
    schema.add({'rating': Number });

    /**
    * Updates the ratings of two models
    * @param {ObjectId} Winner Id
    * @param {ObjectId} Loser Id
    * @param {Function} Result callback
    */
    schema.statics.updateRatings = function(winnerId, loserId, cb) {
        if(winnerId === loserId) {
            cb(new Error('Ids cannot be the same'));
            return;
        }

        return this.find({})
            .where('_id')
            .in([winnerId, loserId])
            .exec(function(err, models) {
                if(err) {
                    cb(err);
                    return;
                }

                let a = models.filter(m => m.id == winnerId)[0];
                let b = models.filter(m => m.id == loserId)[0];

                if(!a) {
                    cb(new Error('Winner model not found'));
                    return;
                }

                if(!b) {
                    cb(new Error('Loser model not found'));
                    return;
                }



                //Gets expected score for first parameter
                var expectedScoreA = elo.getExpected(a.rating, b.rating);
                var expectedScoreB = elo.getExpected(b.rating, a.rating);

                //update score, 1 if won 0 if lost
                a.rating = elo.updateRating(expectedScoreA, 1, a.rating);
                b.rating = elo.updateRating(expectedScoreB, 0, b.rating);

                a.save(err => {
                    if(err) {
                        cb(err);
                        return;
                    }

                    b.save(err => {
                        if(err) {
                            cb(err);
                            return;
                        }

                        cb(null,[a, b]);
                    });
                });

            });
    };

    /**
    * Sorts the model by rating, if a callback is provided 
    * the query is executed, if not the query chain is returned     
    * @param {Function} Execute callback
    * @returns {Query} mongoose model query
    */
    schema.statics.sortByRating = function(cb) {
        let query = this.find({}).sort({'rating': -1});
        if(cb) {
            query.exec(cb);
        } else {
            return query;
        } 
    }
};
