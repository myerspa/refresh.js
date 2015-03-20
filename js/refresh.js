(function() {

  var RefreshBus = function( ) {

    this.process = function( caller ) {
      var target = caller.dataset['refresh-target'];
      var path = caller.dataset['refresh-path'];
      var scope = caller.dataset['refresh-scope'];
      var module = caller.dataset['refresh-module'];
      var converter = caller.dataset['refresh-converter'];

      if ( this._g_begin_callback !== undefined )
        this._g_begin_callback();

      var method = (module === undefined && scope === undefined) ? 'GET' : 'POST';

      var request = new XMLHttpRequest();
      var self = this;
      request.onreadystatechange = function() {
        if ( request.readyState === 4 && request.status === 200 ) {
          self.success( request.responseText, target, converter );
        } else if ( request.readyState === 4 && request.status !== 200 ) {
          self.error();
        }
      };

      request.open(method, path, true);

      if ( method === 'POST' ) {
        var payload = this.datatize(scope !== undefined ? this.processScope(scope) : module());
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(payload);
      } else {
        request.send();
      }

    };

    this.success = function( data, target, converter ) {
      var refreshData = data;
      if ( converter !== undefined ) {
        refreshData = converter(data);
      }

      document.querySelector("#" + target).innerHTML = refreshData;

      if ( this._g_success_callback !== undefined )
        this._g_success_callback(refreshData, data);
      if ( this._g_end_callback !== undefined )
        this._g_end_callback();
    };

    this.processScope = function( scope ) {
      // TODO - Process scope for input / checkboxes and return data object
    };

    this.error = function ( ) {
      if ( this._g_error_callback !== undefined )
        this._g_error_callback();
      if ( this._g_end_callback !== undefined )
        this._g_end_callback();
    };

    this.datatize = function ( data ) {
      var encodedString = '';
      for (var prop in object) {
        if ( object.hasOwnProperty( prop ) ) {
            if ( encodedString.length > 0 ) {
                encodedString += '&';
            }
            encodedString += encodeURI(prop + '=' + object[prop]);
        }
      }
      return encodedString;
    };

  };

  refreshBus = new RefreshBus();
  document.addEventListener( "DOMContentLoaded", function() {
    document.querySelectorAll("[data-refresh]").each(function() {
      this.bindEventListener("click", function(e) {
        e.preventDefault();
        refreshBus.process(this);
      });
    });
  }, false );

})();
