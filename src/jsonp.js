/* JSON-P implementation for Prototype.js somewhat by Dan Dean (http://www.dandean.com)
 * 
 * *HEAVILY* based on Tobie Langel's version: http://gist.github.com/145466.
 * Might as well just call this an iteration.
 * 
 * This version introduces:
 * - onCreate and onFailure callback options and a full response object.
 * - option to not invoke request upon instantiation.
 *
 * Tested in Firefox 3/3.5, Safari 4
 *
 * Note: while I still think JSON-P is an inherantly flawed technique,
 * there are some valid use cases which this can provide for.
 *
 * See examples in README for usage
 */
Ajax.JSONRequest = Class.create(Ajax.Base, (function() {
  var id = 0, head = document.getElementsByTagName('head')[0];
  return {
    initialize: function($super, url, options) {
      $super(options);
      this.options.url = url;
      this.options.callbackParamName = this.options.callbackParamName || 'callback';
      this.options.timeout = this.options.timeout || 10; // Default timeout: 10 seconds
      this.options.invokeImmediately = (!Object.isUndefined(this.options.invokeImmediately)) ? this.options.invokeImmediately : true ;
      if (this.options.invokeImmediately) {
        this.request();
      }
    },
    
    /**
     *  Ajax.JSONRequest#_cleanup() -> "undefined"
     *  Cleans up after the request
     **/
    _cleanup: function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      if (this.transport && Object.isElement(this.transport)) {
        this.transport.remove();
      }
    },
  
    /**
     *  Ajax.JSONRequest#request() -> "undefined"
     *  Invokes the JSON-P request lifecycle
     **/
    request: function() {
      
      // Define local vars
      var response = new Ajax.JSONResponse(this);
      var key = this.options.callbackParamName,
        name = '_prototypeJSONPCallback_' + (id++),
        complete = function() {
          if (Object.isFunction(this.options.onComplete)) {
            this.options.onComplete.call(this, response);
          }
        }.bind(this);
      
      // Add callback as a parameter and build request URL
      this.options.parameters[key] = name;
      var url = this.options.url + ((this.options.url.include('?') ? '&' : '?') + Object.toQueryString(this.options.parameters));
      
      // Define callback function
      window[name] = function(json) {
        this._cleanup(); // Garbage collection
        window[name] = undefined;
        if (Object.isFunction(this.options.onSuccess)) {
          response.status = 200;
          response.statusText = "OK";
          response.setResponseContent(json);
          this.options.onSuccess.call(this, response);
        }
        complete();
      }.bind(this);
      
      this.transport = new Element('script', { type: 'text/javascript', src: url });
      
      if (Object.isFunction(this.options.onCreate)) {
        this.options.onCreate.call(this, response);
      }
      
      head.appendChild(this.transport);

      this.timeout = setTimeout(function() {
        this._cleanup();
        window[name] = Prototype.emptyFunction;
        if (Object.isFunction(this.options.onFailure)) {
          response.status = 504;
          response.statusText = "Gateway Timeout";
          this.options.onFailure.call(this, response);
        }
        complete();
      }.bind(this), this.options.timeout * 1000);
    },
    toString: function() { return "[object Ajax.JSONRequest]"; }
  };
})());

Ajax.JSONResponse = Class.create({
  initialize: function(request) {
    this.request = request;
  },
  request: undefined,
  status: 0,
  statusText: '',
  responseJSON: undefined,
  responseText: undefined,
  setResponseContent: function(json) {
    this.responseJSON = json;
    this.responseText = Object.toJSON(json);
  },
  getTransport: function() {
    if (this.request) return this.request.transport;
  },
  toString: function() { return "[object Ajax.JSONResponse]"; }
});