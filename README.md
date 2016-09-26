FindAndModify
=============

**NB: This package isn't actively maintained at the moment.** I'll review PRs 
as I can, but I'm currently not working on any Meteor projects,
so my incentive to bug-fix is pretty low.

This Meteor package adds [findAndModify](https://docs.mongodb.com/manual/reference/command/findAndModify/) support to Meteor's MongoDB Collections. It should work on both the server and client. It adapts 
and cleans up some code found on https://github.com/meteor/meteor/issues/1070.


Installation
------------

    meteor add fongandrew:find-and-modify


Usage
-----

    TestCollection.findAndModify({
      query: {name: "Batman"},
      update: {$set: {name: "Bruce Wayne"}},
      sort: {age: 1},
      upsert: true,
      new: true,
      fields: {favoriteColor: 0}
    });

    TestCollection.findAndModify({
      query: {name: "Robin"},
      sort: {age: -1},
      skip: 2,  // available only client side
      remove: true
    });

See mongo documentation for arguments details:
http://docs.mongodb.org/manual/reference/method/db.collection.findAndModify/


Known Issues
------------

The client-side code (and the tests for the client-side code) works on the 
assumption that is running in a Meteor method simulation. If run outside of a 
simulation, the client-side code will use an `_id` selector in lieu of your
original query to get around Meteor's restriction on `_id` only updates
for untrusted (client) code. This may result in unusual errors or behavior if
your modifier is dependent on your query selector (e.g. as with positional
operators).

For consistency with Meteor's default behavior, upserts using findAndModify 
use _ids consisting of a 17 character string rather than an ObjectId. This
behavior has only been tested with Mongo 2.6+ and may result in issues with
Mongo 2.4.x.


License
------- 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
