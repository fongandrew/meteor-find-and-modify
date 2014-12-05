FindAndModify
=============

This Meteor package adds [findAndModify](http://docs.mongodb.org/v2.4/reference/command/findAndModify/) support to Meteor's MongoDB Collections. It should work on both the server and client. It adapts 
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
      remove: true
    });


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