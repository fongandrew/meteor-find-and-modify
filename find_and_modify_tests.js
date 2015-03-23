(function() {
  'use strict';

  var TestCollection = new Mongo.Collection("findAndModifyTestCol");
  if (Meteor.isServer) {
    TestCollection.remove({});
    TestCollection.allow({
      insert: function() {return true;},
      remove: function() {return true;},
      update: function() {return true;}
    });
  }

  /** Helper function to create test methods that can run async or sync
   *  depending on context
   *  @param {Function} name - Name for both method and test
   *  @param {Function} method - Something that returns a result and can be
   *    wrapped in a Meteor method.
   *  @param {Function} assertions - A callback that should accept the "test"
   *    object for tinytest and the result from the Meteor method.
   */
  var addTest = function(name, method, assertions) {
    var methodObj = {};
    var returnVal;
    methodObj[name] = function() {
      if (this.isSimulation) {
        returnVal = method(); // Capture outside scope so we can examine the
                              // actual client code indepently of server
                              // response
        return returnVal;
      }
      return method();        // Server runs normally
    };
    Meteor.methods(methodObj);

    if (Meteor.isServer) {
      Tinytest.add(name, function(test) {
        var result = method();
        assertions(test, result);
      });
    }

    else {
      Tinytest.addAsync(name, function(test, done) {
        Meteor.call(name, function(error) {
          test.isFalse(!!error, error);
          try {
            if (returnVal) {
              assertions(test, returnVal);
            } else {
              test.isTrue(false, "Missing return val");
            }
          } finally {
            done();
          }
        });
      });
    }
  }


  addTest("findAndModify - find + set",
    function() {
      TestCollection.remove({});
      var batmanId = TestCollection.insert({ name: "Batman",
                                             favoriteColor: "black" });
      var supermanId = TestCollection.insert({ name: "Superman",
                                               favoriteColor: "blue" });
      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}}
      });
    },
    function(test, result) {
      test.equal(result.name, "Batman");
      test.equal(result.favoriteColor, "black");
    });


  addTest("findAndModify - find + set + new",
    function() {
      TestCollection.remove({});
      var batmanId = TestCollection.insert({ name: "Batman",
                                             favoriteColor: "black" });
      var supermanId = TestCollection.insert({ name: "Superman",
                                               favoriteColor: "blue" });
      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}},
        new: true
      });
    },
    function(test, result) {
      test.equal(result.name, "Bruce Wayne");
      test.equal(result.favoriteColor, "black");
    });


  addTest("findAndModify - upsert when doesn't exist",
    function() {
      TestCollection.remove({});
      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}},
        new: true,
        upsert: true
      });
    },
    function(test, result) {
      test.equal(result.name, "Bruce Wayne");
      test.equal(result.favoriteColor, undefined);
    });


  addTest("findAndModify - upsert when doesn't exist (force str ID)",
    function() {
      TestCollection.remove({});
      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}},
        new: true,
        upsert: true
      });
    },
    function(test, result) {
      test.equal(result.name, "Bruce Wayne");
      test.equal(result.favoriteColor, undefined);
      test.equal(typeof(result._id), "string");
    });


  addTest("findAndModify - upsert when already exists",
    function() {
      TestCollection.remove({});
      var batmanId = TestCollection.insert({ name: "Batman",
                                             favoriteColor: "black" });
      var supermanId = TestCollection.insert({ name: "Superman",
                                               favoriteColor: "blue" });

      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}},
        new: true,
        upsert: true
      });
    },
    function(test, result) {
      test.equal(result.name, "Bruce Wayne");
      test.equal(result.favoriteColor, "black");
    });


  addTest("findAndModify - sort",
    function() {
      TestCollection.remove({});
      TestCollection.insert({ name: "Batman",
                              favoriteColor: "black" });
      TestCollection.insert({ name: "Superman",
                              favoriteColor: "blue" });
      TestCollection.insert({ name: "Flash",
                              favoriteColor: "red" });
      return TestCollection.findAndModify({
        query: {name: {$exists: true}},
        sort: {name: -1},
        update: {$set: {name: "Clark Kent"}},
        new: true
      });
    },
    function(test, result) {
      test.equal(result.name, "Clark Kent");
      test.equal(result.favoriteColor, "blue");
    });


  addTest("findAndModify - remove",
    function() {
      TestCollection.remove({});
      TestCollection.insert({ name: "Batman",
                              favoriteColor: "black" });
      TestCollection.insert({ name: "Superman",
                              favoriteColor: "blue" });
      var findAndModifyResponse = TestCollection.findAndModify({
        query: {name: "Batman"},
        remove: true
      });
      var count = TestCollection.find({}).count();
      var batman = TestCollection.findOne({name: "Batman"});
      return {
        findAndModifyResponse: findAndModifyResponse,
        count: count,
        batman: batman
      };
    },
    function(test, result) {
      test.equal(result.findAndModifyResponse.name, "Batman");
      test.equal(result.findAndModifyResponse.favoriteColor, "black");
      test.equal(result.count, 1);
      test.equal(result.batman, undefined);
    });


  addTest("findAndModify - fields",
    function() {
      TestCollection.remove({});
      var batmanId = TestCollection.insert({ name: "Batman",
                                             favoriteColor: "black" });
      var supermanId = TestCollection.insert({ name: "Superman",
                                               favoriteColor: "blue" });

      return TestCollection.findAndModify({
        query: {name: "Batman"},
        update: {$set: {name: "Bruce Wayne"}},
        fields: {
          favoriteColor: 0
        }
      });
    },
    function(test, result) {
      test.equal(result.name, "Batman");
      test.equal(result.favoriteColor, undefined);
    });


  addTest("findAndModify - positional operators",
    function() {
      TestCollection.remove({});
      var justiceLeague = TestCollection.insert({
        heroes: [
          { name: "Batman", favoriteColor: "black"},
          { name: "Superman", favoriteColor: "blue"},
          { name: "Wonder Woman", favoriteColor: "red"},
        ]
      });
      var avengers = TestCollection.insert({
        heroes: [
          { name: "Iron Man", favoriteColor: "gold"},
          { name: "Hulk", favoriteColor: "green"},
          { name: "Captain America", favoriteColor: "blue"}
        ]
      });

      return TestCollection.findAndModify({
        query: {"heroes.name": "Batman"},
        update: {$set: {"heroes.$.favoriteColor": "darkness"}},
        new: true
      });
    },
    function(test, result) {
      test.equal(result.heroes[0].name, "Batman");
      test.equal(result.heroes[0].favoriteColor, "darkness");
    });

})();
