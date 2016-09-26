## v.1.0.0

* Fix for compatability with Meteor 1.4.x. Supports writeConcern.
  Thanks to @tcastelli.

## v.0.2.1

* Update to use the `rawCollection` method introduced in Meteor 1.0.4.

## v.0.2.0

* upserts now use a string _id of 17 random characters for consistency with
  Meteor's default behavior. #4
