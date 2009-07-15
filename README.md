Examples
========

The Basics
----------

Your options are:

* `onCreate`: When the request is built but before it is invoked
* `onSuccess`: When the request is completed
* `onFailure`: When the request times out and fails
* `callbackParamName`: The name of the callback query parameter to use (defaults to "callback")
* `parameters`: Parameters to pass to the request
* `timeout`: The milliseconds before canceling the request and invoking onFailure

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat',
    tagmode: 'any',
    format: 'json'
  },
  onCreate: function(instance) {
    console.log("create", this);
  },
  onSuccess: function(instance) {
    console.log("complete", this);
  },
  onFailure: function(instance) {
    console.log("fail", this);
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
    tags: 'cat',
    tagmode: 'any',
    format: 'json'
  },
  onCreate: function(instance) {
    console.log("create", this);
  },
  onSuccess: function(instance) {
    console.log("complete", this);
  },
  onFailure: function(instance) {
    console.log("fail", this);
  }
});
</pre>

Using a custom timeout period
-----------------------------

You can set your own `timeout` period. This example sets this timeout to
100 milliseconds which is pretty much guaranteed to fail. 

<pre>
new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
  timeout: 100,
  callbackParamName: "jsoncallback",
  parameters: {
    tags: 'cat',
    tagmode: 'any',
    format: 'json'
  },
  onCreate: function(instance) {
    console.log("create", this);
  },
  onSuccess: function(instance) {
    console.log("complete", this);
  },
  onFailure: function(instance) {
    console.log("fail", this);
  }
});
</pre>

Credits
=======

Ajax.JSONRequest is based on a gist originally posted by
Tobie Langel at http://gist.github.com/145466

The version you see here is basically an enhancement on top of that,
with most all of the core structure originating from there.