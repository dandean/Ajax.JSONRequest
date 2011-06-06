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

Handling response content:

The first (and only) argument passed to your response handlers is a `Ajax.JSONResponse` object.
Access the resulting JSON data via that object's `responseJSON` property or get at the raw JSON
string with that object's `responseText` property.

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat', tagmode: 'any', format: 'json'
  },
  onCreate: function(response) {
    console.log("1: create", response, response.responseJSON);
  },
  onSuccess: function(response) {
    console.log("1: success", response, response.responseJSON);
  },
  onFailure: function(response) {
    console.log("1: fail", response, response.responseJSON);
  },
  onComplete: function(response) {
    console.log("1: complete", response, response.responseJSON);
  }
});
</pre>

Handling Failures
-----------------

Since there is no way to inspect what happens after we make a request with the JSONP
technique, we're stuck having to make informed guesses about what's going on.

This example makes a request to an invalid URL. Since the callback is not invoked
within the default `timeout` period (10 seconds) the request is "cancelled" and
the `onFailure` callback is invoked if specified. The `Ajax.JSONResponse` will have
the `status` of 504 and `statusText` of "Gateway Timeout".

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/asdfasdfasdfasdfasdfsdf', {
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat', tagmode: 'any', format: 'json'
  },
  onCreate: function(response) {
    console.log("2: create", response, response.responseJSON);
  },
  onSuccess: function(response) {
    console.log("2: success", response, response.responseJSON);
  },
  onFailure: function(response) {
    console.log("2: fail", response, response.responseJSON);
  },
  onComplete: function(response) {
    console.log("2: complete", response, response.responseJSON);
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
  onCreate: function(response) {
    console.log("3: create", response, response.responseJSON);
  },
  onSuccess: function(response) {
    console.log("3: success", response, response.responseJSON);
  },
  onFailure: function(response) {
    console.log("3: fail", response, response.responseJSON);
  },
  onComplete: function(response) {
    console.log("3: complete", response, response.responseJSON);
  }
});
</pre>

Making signed requests
----------------------

To make a signed request (such as an OAuth request), it is generally necessary to 
fix the callback parameter before generating the request signature. To support this, 
if the property corresponding to `callbackParamName` is defined in the `parameters` 
object, that callback will be used instead of an automatically generated one.

When providing your own callback parameter, keep the asynchronous aspect of these 
requests in mind. It is possible for two requests with the same callback parameter 
to overwrite each other; therefore, it is recommended that you make these callback 
parameters unique for any requests that may occur concurrently.

Credits
=======

`Ajax.JSONRequest` is based on a gist originally posted by
Tobie Langel at <http://gist.github.com/145466>

The version you see here is basically an enhancement on top of that,
with most all of the core structure originating from there.