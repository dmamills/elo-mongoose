# elo mongoose plugin

A mongoose plugin that adds the ability to use the elo rating system on a model. Built using my [elo-rank](http://github.com/dmamills/elo-rank) library. Note: only tested on node `v5.0.0`

## example

```javascript
const mongoose = require('mongoose');
const eloPlugin = require('elo-mongoose');

let schema = new mongoose.Schema({
    name: String
});

schema.plugin(eloPlugin);

const TestModel = mongoose.model('TestModel', schema);

TestModel.create({
    name: 'test',
    rank: 1500
}, (err, model) => {
    console.log(model.rating) // => 1500

    // First id is the winner
    TestModel.updateRatings(model.id, someOtherId, (err, models) {
        //returns both models with their update ratings
        console.log(models);
    });
});
```

## api

* `model.rating` the added rating column
* `Model#updateRatings` used to save a match outcome
* `Model#sortByRating` returns a chainable mongoose query object sorted by rating, if a callback is provided it executes the query

## license

do wutever u want whenever u feel like it
