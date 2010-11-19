var console = {
  assert: function(test, msg) {
    top.console.assert(test, VERSION + ": " + msg);
  },
  log: function(msg) {
    top.console.log(VERSION + ": " + msg);
  },
  info: function(msg) {
    top.console.info(VERSION + ": " + msg);
  }
};

document.observe("dom:loaded", function(e) {
  document.body.appendChild(new Element("h1").update("Prototype.js Version " + VERSION));
  
  console.info("One request should succeed and two should fail within ten seconds...");

  var created = 0,
      successful = 0,
      failed = 0,
      completed = 0;
  
  test1();
  
  function test1() {
    new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
      callbackParamName: "jsoncallback",
      parameters: {
        tags: 'cat', tagmode: 'any', format: 'json'
      },
      onCreate: function(response) {
        created++;
        console.log("jsonp request 1: created", response, response.responseJSON);
      },
      onSuccess: function(response) {
        successful++;
        console.log("jsonp request 1: successful", response, response.responseJSON);
      },
      onFailure: function(response) {
        failed++;
        console.log("jsonp request 1: failed", response, response.responseJSON);
      },
      onComplete: function(response) {
        completed++;
        console.log("jsonp request 1: completed", response, response.responseJSON);
        test2();
      }
    });
  }

  function test2() {
    // Invalid URL never calls onSuccess. Times out in 10 seconds causing onFailure.
    new Ajax.JSONRequest('http://api.flickr.com/services/feeds/asdfasdfasdfasdfasdfsdf', {
      callbackParamName: "jsoncallback",
      parameters: {
        tags: 'cat', tagmode: 'any', format: 'json'
      },
      onCreate: function(response) {
        created++;
        console.log("jsonp request 2: created", response, response.responseJSON);
        console.log("this request has an invalid URL, so will fail in 10 seconds.");
      },
      onSuccess: function(response) {
        successful++;
        console.log("jsonp request 2: successful", response, response.responseJSON);
      },
      onFailure: function(response) {
        failed++;
        console.log("jsonp request 2: failed", response, response.responseJSON);
      },
      onComplete: function(response) {
        completed++;
        console.log("jsonp request 2: completed", response, response.responseJSON);
        test3();
      }
    });
  }

  function test3() {
    // Timeout is super short, should fail
    new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {

      // Short timeout illustrates failure mechanism. This will "fail" because we don't
      // get a response in time.
      timeout: 0.1,

      callbackParamName: "jsoncallback",
      parameters: "tags=cat&tagmode=any&format=json",
      onCreate: function(response) {
        created++;
        console.log("jsonp request 3: created", response, response.responseJSON);
        console.log("this request has a VALID URL, but will fail since the timeout is shorter than it takes to get the response.");
      },
      onSuccess: function(response) {
        successful++;
        console.log("jsonp request 3: successful", response, response.responseJSON);
      },
      onFailure: function(response) {
        failed++;
        console.log("jsonp request 3: failed", response, response.responseJSON);
      },
      onComplete: function(response) {
        completed++;
        console.log("jsonp request 3: completed", response, response.responseJSON);
        results();
      }
    });
  }
  
  function results() {
    console.assert(created === 3, "3 requests should have been created.");
    console.assert(successful === 1, "1 request should have been successful.");
    console.assert(failed === 2, "2 requests should have been failures.");
    console.assert(completed === 3, "3 requests should have been completed.");
    console.info('Demo complete.');
    
    top.testNextVersion();
  }
});
