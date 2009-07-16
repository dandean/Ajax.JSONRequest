Ajax.JSONRequest is JSONP for Prototype.js
==========================================

The Basics
----------

Your options are:

* `onCreate`: When the request is built but before it is invoked
* `onSuccess`: When the request is completed
* `onFailure`: When the request times out and fails
* `onComplete`: When the request is completed, regardless of success or failure
* `callbackParamName`: The name of the callback query parameter to use (defaults to "callback")
* `parameters`: Parameters to pass to the request
* `timeout`: The seconds before canceling the request and invoking onFailure

You access the resulting JSON data within your handlers via the `responseJSON` property.

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat', tagmode: 'any', format: 'json'
  },
  onCreate: function(request) {
    console.log("1: create", request, request.responseJSON);
  },
  onSuccess: function(request) {
    console.log("1: success", request, request.responseJSON);
  },
  onFailure: function(request) {
    console.log("1: fail", request, request.responseJSON);
  },
  onComplete: function(request) {
    console.log("1: complete", request, request.responseJSON);
  }
});
</pre>

Handling Failures
-----------------

Since there is no way to inspect what happens after we make a request with the jsonp
technique, we're stuck having to make informed guesses about what's going on.

This example makes a request to an invalid URL. Since the callback is not invoked
within the default `timeout` period (10 seconds) the request is "cancelled" and
the `onFailure` callback is invoked if specified.

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/asdfasdfasdfasdfasdfsdf', {
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat', tagmode: 'any', format: 'json'
  },
  onCreate: function(request) {
    console.log("2: create", request, request.responseJSON);
  },
  onSuccess: function(request) {
    console.log("2: success", request, request.responseJSON);
  },
  onFailure: function(request) {
    console.log("2: fail", request, request.responseJSON);
  },
  onComplete: function(request) {
    console.log("2: complete", request, request.responseJSON);
  }
});
</pre>

Using a custom timeout period
-----------------------------

You can set your own `timeout` period. This example sets this timeout to
0.1 seconds which is pretty much guaranteed to fail. 

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {

  // Short timeout illustrates failure mechanism. This will "fail" because we don't
  // get a response in time.
  timeout: 0.1,

  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat', tagmode: 'any', format: 'json'
  },
  onCreate: function(request) {
    console.log("3: create", request, request.responseJSON);
  },
  onSuccess: function(request) {
    console.log("3: success", request, request.responseJSON);
  },
  onFailure: function(request) {
    console.log("3: fail", request, request.responseJSON);
  },
  onComplete: function(request) {
    console.log("3: complete", request, request.responseJSON);
  }
});
</pre>

Credits
=======

`Ajax.JSONRequest` is based on a gist originally posted by
Tobie Langel at <http://gist.github.com/145466>

The version you see here is basically an enhancement on top of that,
with most all of the core structure originating from there.