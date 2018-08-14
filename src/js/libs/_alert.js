
//- MANAGE ALERTS
var Alert = ( function(  ){

  var
  _el,
  _opt = {  },
  _closeEvent = {  },
  _redirectEvent = {  },
  _target,

  _nameSpace = {

    fillMessage : function( options ){
      var
      html = '';

      if( typeof options === 'object' ){

        html = fillView({ data:options, view: options.view });
      }

      return html;
    },

    setMessage : function( options ){

      //console.info(options);

      var vista;

      if(options.view != undefined){
        //console.info('hay');
        vista = options.view[0].innerHTML;
      }else{
        //console.info('no hay');
        vista = _defaults[ 'view' ];
      }

      //console.info(vista);

      _opt = $.extend(
        {},
         {
          el    : options[ 'el' ] || _defaults[ 'el' ],
          target  : options[ 'target' ] || _defaults[ 'target' ],
          classe  : options[ 'classe' ] || _defaults[ 'classe' ],
          type  : options[ 'type' ] || _defaults[ 'type' ],
          title : options[ 'title' ] || _defaults[ 'title' ],
          message : options[ 'message' ] || _defaults[ 'message' ],
          //view  : options[ 'view' ] || _defaults[ 'view' ],
          view : vista,
          onComplete : null,
          onClose : null,
          redirect: null
        },
        options

      );
    },

    showMessage : function( type ){

      var
      element,
      _type = type || 'lbox';

      if( typeof _opt !== 'undefined' && typeof _opt.el !== 'undefined'  ){

        _target = _opt.target;

        if( $( '#'+_opt.el ).length ){
          _el = $( '#'+_opt.el );

        }else{
          _el = document.createElement( 'DIV' );
          _el.id = _opt.el;
          _el.className = _opt.classe
          _el = $( _el );


          if( !$('#'+_target).length ){
            $('#js').append('<div id="'+_target+'"></div>' );
          }

          $( '#'+_target ).append( _el );
        }

        _el.fadeIn( 'fast', function( e ){
          if( _opt.onComplete !== null &&  typeof _opt.onComplete === 'function' ){
            _opt.onComplete(  );
          }
        });

        _closeEvent[ _opt.el ] = _opt.onClose !== null ? _opt.onClose : null;
        _redirectEvent[ _opt.el ] = _opt.redirect !== null ? _opt.redirect : null;

        _el.html( Alert.fillMessage( _opt ) );

        element = $( '#'+_opt.el );
        element.off( 'click' );

        $(element.find( '.Lbox-cont' )).css({ 'margin-top':  Math.round( ($( element.find( '.Lbox-cont' ) ).height()+ 88 ) / -2) });

        if( element.hasClass( 'Lbox' ) && type != 'modal'){

          element.on( 'click', '.Lbox-overlay', function( e ){
            var
            that = $( this );

            e.stopPropagation(  );
            Alert.close( element );
          });
          element.on( 'click', '.Lbox-cont', function( e ){
            var
            that = $( this );
            e.stopPropagation(  );
          });
        }

        element.on( 'click', '.btn-close, .lbox-close, .btn-accept, .btn-cancel', function( e ){
          var
          that = $( this ),
          status = that.hasClass('btn-accept')? true : false;
          e.stopPropagation(  );

          Alert.close( element, status );

        });

      }else{
        throw 'Messages PlugIn :: Fill the data of the message... Example: {classe:[string: "error" or "success" ], title:[string], message:[string]}';
      }
    },

    close : function( element, status ){
      var
      _id = element.attr( 'id' );
      element.fadeOut('fast', function() {
        if( _redirectEvent[ _id ] !== null && typeof _redirectEvent[ _id ] === 'string'  ){

          window.location = _opt.redirect;

        }else{
          if( _closeEvent[ _id ] !== null &&  typeof _closeEvent[ _id ] === 'function' ){
            _closeEvent[ _id ]( status );
          }
        }

      });
    }

  },

  _defaults = {
    el : 'messageLbox',
    target : 'lbox',
    classe : 'Lbox',
    type: 'error',
    title :  'Error',
    message : 'Ocurrio un Error inesperado',
    view :
      '<div class="Lbox-overlay">'
      + '<div class="Lbox-holder">'
      +   '<div class="Lbox-cont">'
      +     '<span class="btn-close"></span>'
      +     '<span class="ico-status {{type}}"></span>'
      +     '<h3 class="Lbox-title">{{title}}</h3>'
      +     '<p class="Lbox-desc">{{message}}</p>'
      +   '</div>'
      + '</div>'
      +'</div>'
  };

  return _nameSpace;

})(  );
