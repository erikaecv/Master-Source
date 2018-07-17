fillView = function(options){
	var config = $.extend({
			data:null,
			view:'<p>Utiliza una vista válida</p>',
			opt:null
		},options),
		regX = /[\{\{\}\}]*/g, //  /[\[\]]*/g
		data = config.data,
		//tmpView = config.view,
		//arr = config.view.match( /\{\{([^ \{\}])+\}\}/g ),  // /\[([^ \[\]\{\}])+\]/g
		tmpView = config.view[0].innerHTML,
		arr = tmpView.match( /\{\{([^ \{\}])+\}\}/g ),  // /\[([^ \[\]\{\}])+\]/g
		opt = config.opt,
		txt = '';

		if(arr){
			var length = arr.length,
				val;
			for(var i=0; i<length;i++){
				val = arr[i].replace(regX,'');
				if(data[val] == undefined && val.indexOf('.') == -1){
					data[val] = '';
				}
				if(opt){
					for(var key in opt){
						if(val == key){
							for(var subKey in opt[key]){
								if( data[val] == subKey){
									tmpView = tmpView.replace(arr[i], opt[key][subKey] );
									break;
								}
							}
						}
					}
				}
				try{
					txt = eval('data.'+val);
				}catch(err){
					txt = '';
				}
				tmpView = tmpView.replace(arr[i], txt );
			}
		}
	return tmpView;
};
fillViews = function( data, view, intervals ){
	/*
		EXAMPLE INTERVAL
		[
			{
				'class' : 'odd',
				'init' : 1,
				'interval' : 4
			}
		]
	*/
	var
	html = '',
	step;

	for(var i = 0, length = data.length; i < length ; i = i+1 ){
		if( intervals !== null && intervals !== undefined ){
			for( var j=0, jLength = intervals.length; j<jLength; j = j +1 ){
				step = intervals[ j ];
				
				if( i === step['init'] ){
					data[i].customClass = step['class'];
				}
				if( i > step['init'] && i >= step['init']+step['interval'] ){
					if( ( i - step['init'] ) % step['interval'] === 0 ){
						data[i].customClass = step['class'];			
					}
				}
			}
		}
		html += fillView({data:data[i], view:view});
	}
	return html;
};

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
      
      _opt = $.extend(
        {},
         {
          el    : options[ 'el' ] || _defaults[ 'el' ],
          target  : options[ 'target' ] || _defaults[ 'target' ],
          classe  : options[ 'classe' ] || _defaults[ 'classe' ],
          type  : options[ 'type' ] || _defaults[ 'type' ],
          title : options[ 'title' ] || _defaults[ 'title' ],
          message : options[ 'message' ] || _defaults[ 'message' ],
          view  : options[ 'view' ] || _defaults[ 'view' ],
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
var customSelect = (function(){

	//- - - - - - - - - - - - - - - 
	//- EVENTOS
	//- - - - - - - - - - - - - - - 
	var
	_selectEvents = (function(){

		//- - - - - - - - - - - - - - - 
		//- TOGGLE ABIERTO - CERRADO
		$(document).on( 'click tap', function(e){
			_closeSelect( $( '.customSelect' ) );
		});

		$('body').on( 'click tap', '.customSelect', function(e){
			var
			that = $(this);

			if( that.hasClass('disabled') ){
				return false;
			}

			if( that.hasClass('open') ){
				_closeSelect( that );
			}else{
				_closeSelect( $( '.customSelect' ) );
				that.addClass('open');
				that.find('select').trigger('focus');
			}
			
			e.stopPropagation();
		});

		//- - - - - - - - - - - - - - - 
		//- ABRE - CIERRA CON EL TABULADOR
		$('body').on('focus', 'select, .customSelect-search', function(e){
			var
			custom = $(this).closest('.customSelect');

			_closeSelect( $( '.customSelect' ) );
			custom.addClass('open');
			
		});


		//- - - - - - - - - - - - - - - 
		//- SELECCIONA UNA OPCIÓN
		$('body').on( 'click tap', '.customSelect-options label', function(e){
			var
			that     = $(this),
			value    = that.index(),
			options  = that.parent().children( ),
			select   = that.closest( '.customSelect' ).find( 'select' ),
			label    = that.closest( '.customSelect' ).find( '.customSelect-label' ),
			multiple = that.closest( '.customSelect' ).hasClass('multiple')? true : false;

			e.stopPropagation();

			if( !that.hasClass('selected') ){

				if( !multiple ){
				
					options.removeClass( 'selected' );
					label.text( that.text() );
					that.addClass( 'selected' );
					_closeSelect( that.closest( '.customSelect' ) );
				
				}else{
					that.addClass( 'selected hide' );
					_addTag( that );
				}

				select.find('option').get( that.index()).selected = true;
				$(select).trigger('change');

			}
		});
		

		//- - - - - - - - - - - - - - - 
		//- NAVEGACIÓN CON FLECHAS DEL TEClADO
		$('body').on('keydown', 'select', function(e){
			var
			key    = e.keyCode,
			select = $(this).closest('.customSelect'),
			terms;

			switch( key ){
				case 13:
				case 40:
				case 38:
					e.preventDefault();
					_navSelect( select, key );
					break;
				

				case 39:
				case 37:
					e.preventDefault();
					break;

				case 27:
					_closeSelect( select );
					break;
			}

		});

		//- Prevenir que el formulario se envien con ENTER
		$('body').on('keydown', '.customSelect-search', function(e){
				var
				key = e.keyCode;

				if( key == 13 ){
					e.preventDefault();
				}
		});

		$('body').on('keyup', '.customSelect-search', function(e){
			var
			key    = e.keyCode,
			select = $(this).closest('.customSelect'),
			terms  = select.find('.customSelect-options label').not('.hide');


			switch( key ){
				case 13:
				case 40://Down
				case 38://UP
					e.preventDefault();
					_navSelect( select, key );
					break;

				case 39://Right
				case 37://Left
					break;

				default:
					_namespace.filter( select );
					
					break;
			}

		});


		//- - - - - - - - - - - - - - - 
		//- FILTRO
		$('body').on( 'click tap', '.customSelect input, .customSelect-filter',function(e){
			e.stopPropagation();
		});


		//- - - - - - - - - - - - - - - 
		//- SELECT MULTIPLE TAGS
		$('body').on( 'click tap', '.customSelect-tag',function(e){
			var
			that   = $(this),
			custom = $('#' + that.closest('.customSelect-tagList').attr('id').replace( 'customTags-','custom-' )),
			select = $(custom.find('select')),
			index  = that.attr('data-index');
			

			$(select.find('option').get(index))[0].selected = false;
			$(custom.find('.customSelect-options label').get(index)).removeClass('selected hide');

			that.remove();


		});


	})();

	var
	_navSelect = function( select, key ){

		var
		items   = select.find('.customSelect-options label').not('.hide'),
		current = select.find('.active');

		if( key == 13 ){
			
			if( current.length ){
				try{
					$(current[0]).trigger('click');
				}catch(err){}
			}
		}
		
		if( current.length ){
			
			for( var i=0, lg=items.length; i<lg; i++ ){
				if( current[0] == items[i] ){
					
					items.removeClass('active');
					switch( key ){
						case 40:
							current = $(items[i +1]).addClass('active');
							break;
						
						case 38:
							current = $(items[i - 1]).addClass('active');
							break;
					}

					if( !current.length ){
						$(items[i]).addClass('active');
					}

					break;
				}
			}

		}else{
			$(items[0]).addClass('active');
		}
	};

	var
	_closeSelect = function( select ){

		select.removeClass('open');
		select.find('label').removeClass('active');
		if( !select.hasClass('multiple') ){
			select.find('label').removeClass('hide');
		}
		select.find('.customSelect-search').val('');
	};

	var
	_addTag = function( option ){
		var
		html = '',
		target,
		items,
		current;
		
		if( option[0].tagName == 'SELECT' ){

			items = option.find(':selected');

			for( var i=0, lg=items.length; i<lg; i++ ){
				current = $(items[i]);
				
				html += '<span class="customSelect-tag" data-val="'+current.val()+'" data-index="'+current.index()+'">'+current.text()+'</span>';
			}

			return html;
		
		}else{
			html = '<span class="customSelect-tag" data-val="'+option.attr('data-val')+'" data-index="'+option.index()+'">'+option.text()+'</span>';
			target = $('#customTags-' + option.closest('.customSelect').find('select')[0].id);
			target.append( html );
		}
		
	};

	var
	_removeTag = function( option ){

	};


	//- - - - - - - - - - - - - - - 
	//- PÚBLICO
	//- - - - - - - - - - - - - - - 
	var
	_namespace = {

		update : function( element ){

			var
			id;

			var
			init = function(){
				var
				item,
				options;

				for( var i=0, lg=element.length; i<lg; i++ ){
					item = $(element[i]);
					
					if( !item.closest('.customSelect').length ){
						_makeSelect( item );
					}else{
						options = _getOptions( item );
						item.closest('.customSelect').find('.customSelect-options').html( options.html );
						item.closest('.customSelect').find('.customSelect-label').html( options.label );
					}
				}
			};

			var
			_makeSelect = function( select ){

				var
				wrapper = $(document.createElement( 'SPAN' )),
				options = _getOptions( select ),
				html    = '',
				tags    = '',
				autoSelect = select.hasClass( 'filter'   )? true : false,
				multiple   = select.attr( 'multiple' )? true : false,
				formId     = select[0].form.id? select[0].form.id : 'form',
				name;

				if( multiple ){
					select.addClass('multiple');
					wrapper.attr( 'multiple', true );

					tags = 
						'<div id="customTags-'+ select.attr('id') +'" class="customSelect-tagList">'
						+	_addTag( select );
						+'</div>';
				}


				html =
					'<span class="currentSelect"></span>'
					+	'<span class="customSelect-label">'+ options.label + '</span>'
					+	'<i class="customSelect-arrow"></i>';

				if( autoSelect ){
					html +=
						'<span class="customSelect-filter">'
						+    '<input type="text" class="customSelect-search noLabel" data-name="" id="auto_' +'"  autocomplete="off" />'
						+'</span>';
				}

				html += 
					'<span class="customSelect-options">'
					+	options.html
					+'</span>';

				html += '</span>';

				wrapper[0].className = 'customSelect ' + select[0].className + ( select.is(':disabled')? ' disabled' : '' );
				if( select.attr('id') !== undefined ){
					wrapper[0].id = 'custom-'+ select.attr('id');
				}
				wrapper.html( html );
				select.wrap( wrapper );
				$(tags).insertAfter( select.closest('.customSelect') );


			};


			var
			_getOptions = function( item ){

				var
				options = item.find('option'),
				select  = item, 
				html    = '',
				classe,
				label,
				item;

				for( var i=0, lg=options.length; i<lg; i++ ){
					
					item    = $(options[i]);
					classe  = '';
					
					if( i == 0 ){
						label = item.text();
					}
					
					if( item.is(':selected') ){
						classe = 'class="selected"';
						label  = item.text();

						if( select.attr('multiple') ){
							classe = 'class="selected hide"';
						}
					}

					if( select.attr('multiple') ){
						label = select.attr('data-name');
					}
					
					html += '<label '+classe+' data-val="'+item.val()+'" >'+item.text()+'</label>';

				}


				return {
					html  : html,
					label : label
				}

			};
			
			init();

		},

		filter : function( element, term ){

			var
			field  = element.find( '.customSelect-search' ),
			labels = element.find('.customSelect-options label'),
			term   = term || field.val(),
			item;

			labels.removeClass('hide active');

			if( element.hasClass('multiple') ){
				element.find('.selected').addClass('hide');
			}

			if( field.val().length < 3 ){
				return false;
			}
			
			for( i=labels.length-1; i>=0; i-- ){
				item = $(labels[i]);
				
				if( item.text().toLowerCase().indexOf( term ) == -1 ){
					item.addClass( 'hide' );
				}
			}

		},
		
		reset  : function( element ){

			var
			item,
			select,
			option;

			
			for( var i=0, lg=element.length; i<lg; i++ ){
				item = $(element[i]);
				
				select = item.closest('.customSelect');
				select[0].className = 'customSelect ' + item[0].className;

				$(item.find('options')).attr('selected', false);

				select.find( '.customSelect-options label').removeClass('hide active selected');
				
				if( !select.hasClass('multiple') ){
					select.find( '.customSelect-options label:first-child' ).trigger('click');
				}else{
					$(element.find('option')).attr('selected', false);
					$('#customTags-' + select.attr('id')).find('.customSelect-tag').remove();
				}

			}
		}
	};

	var
	startAll = (function(){
		var
		selects = $('select').not('.noCustom');
		
		for( var i=selects.length-1; i>-1; i--  ){
			_namespace.update(  $(selects[i])  );
		}

	})();


	return _namespace;

})();


$.fn.extend({
	updateSelect : function(){
		customSelect.update( $(this) );
	},

	resetSelect : function(){
		customSelect.reset( $(this) );
		customFields.reset( $(this) )
		//$(this).trigger('change');
	}

});


//- - - - - - - - - - - - - - - 
//- EJEMPLO
//- - - - - - - - - - - - - - - 

//- Update
//customSelect.update( $('#s3') );
//$('#s3').updateSelect();

//- Reset
//customSelect.reset( $('#s3') );
//$('#s3').resetSelect();

( function ( ){

	var	inputs = $( '[type=text],[type=password],[type=email], textarea' ),
		selectF = $('select').not('.noLabel'),
		primerLabel = inputs.parent().hasClass( 'currentInput' )? true : false,
		labelVal;

	var init = function ( ){
		if( $(inputs).length || $(selectF).length){
			floatLabel();
		}

		console.info( inputs.parent());
	};

	var floatLabel = function(){
		var labelS = $(selectF).parents('.customSelect'),
			labelT = $(selectF).data('name'),
			inhab = $('.disabled'),
			inputsFloat = $(inputs).not('.noLabel'),
			wrapI;

		var eventosInput = (function(){
			$(inputsFloat).on('focus', function(){
				wrapI = $(this).parents('.currentInput').addClass('activo');

				labelVal = $(this).data('name');

				$(wrapI).find('label').text(labelVal);

				if($(wrapI).hasClass('listo')){
					$(this).removeClass('listo');
				}

				if($(this).hasClass('password')){
					var that = $(this);
					$(that).removeAttr("type").prop('type', 'password');
				}
			});


			$(inputsFloat).on('blur', function(){
				wrapI = $(this).parents('.currentInput');
				$(wrapI).removeClass('activo').addClass('listo');

				if($(this).val()== "" || $(this).val() == labelVal){
					$(wrapI).removeClass('listo activo');
					
					if($(this).hasClass('password')){
						var that = $(this);
						$(that).removeAttr("type").prop('type', 'text');
					}
				}
			});

			$(selectF).on('change', function(){
				if($('.labelFl').text != $('.customSelect-label').text()){
					$(this).parents('.customSelect').addClass('listo');
				}
			});

		})();

		$.fn.extend({
			updateInput : function(){
				//console.info('aqui empieza');
				for(j=0; j<inputsFloat.length; j++){
					if(!primerLabel){
						$(inputsFloat[j]).wrap('<span class="currentInput"></span>');
						$(inputsFloat[j]).parent().prepend('<label></label>');
					}

					if($(inputsFloat[j]).val() != "" || $(inputsFloat[j]).hasClass('disabled') ){
						if($(inputsFloat[j]).val() != $(inputsFloat[j]).data('name')){
							//console.info('son diferentes');
							$(inputsFloat[j]).parent().addClass('listo');
							$(inputsFloat[j]).prev().text($(inputsFloat[j]).data('name'));
						}
					}
				}	
			}	
		});

		$.fn.extend({
			updateLabelSelect : function(){
				$(labelS).prepend('<label class="labelFl"></label>');
		
				if($(labelS).length){
					for(s=0; s<labelS.length; s++){
						$(labelS[s]).find('.labelFl').text($(labelS[s]).find('select').data('name'));
					}
				}
			}
		});

		var start = (function(){
			$(inputsFloat).updateInput();
			$(labelS).updateLabelSelect();
		})();

	};


	init();

});


var
customFields = (function(){

	//- - - - - - - - - - - - - - - 
	//- EVENTOS
	//- - - - - - - - - - - - - - - 
	var
	_inputEvents = (function(){
		var
		fields = '[type=text], [type=email], [type=password], textarea, select';

		//- - - - - - - - - - - - - - - 
		//- Muestra el label
		$('body').on('focus', fields, function(e){
			$(this).closest('.currentInput').addClass('activo');

			if($(this).hasClass('password')){
				var that = $(this);
				$(that).removeAttr("type").prop('type', 'password');
			}
		});


		//- - - - - - - - - - - - - - - 
		//- Muestra / Esconde el label al validar
		$('body').on('blur', fields, function(e){
			var
			that   = $(this),
			holder = that.closest('.currentInput');

			if( that[0].tagName == 'SELECT' ){
				return false;
			}
			
			if( that.val() !== that.attr('data-name') && that.val().length >= 1 ){
				holder.addClass('listo');
			}else{
				holder.removeClass('listo');
				if($(that).hasClass('password')){
					$(that).removeAttr("type").prop('type', 'text');
				}
			}
			
			holder.removeClass('activo');
		});

		//- - - - - - - - - - - - - - - 
		//- .customSelect
		$('body').on('change', 'select', function(e){
			var
			that   = $(this),
			holder = that.closest('.currentInput');

			if( that.val() !== '' ){
				holder.addClass('listo');
			}else{
				holder.removeClass('listo');
			}
		});
		$('body').on('blur', 'select', function(e){
			var
			that   = $(this),
			holder = that.closest('.currentInput');
			
			setTimeout( function(){
				holder.removeClass('activo');
			}, 200 );

		});


	})();


	//- - - - - - - - - - - - - - - 
	//- PÚBLICO
	//- - - - - - - - - - - - - - - 
	_namespace = {

		update: function( element ){

			var
			_init = function(){
				var
				item;

				for( var i=0, lg=element.length; i<lg; i++ ){
					item = $(element[i]);

					if( !item.closest('.currentInput').length ){
						_makeInput( item );
					}else{
						item.closest('.currentInput').addClass('listo');
					}
				}
			};

			var
			_makeInput = function( input ){

				var
				wrapper = document.createElement( 'SPAN' ),
				label   = input.attr('data-name'),
				status  = '';
				
				//- - - - - - - - - - - - - - - 
				//- Validar si esta lleno
				if( input.val() != label ){
					status = ' listo';
				}


				//- - - - - - - - - - - - - - - 
				//- Validar si es un customSelect
				if( input.hasClass('customSelect') ){
					label = $(input.find('select')).attr('data-name');
					if( $(input.find('select')).val() == '' ){
						status = '';
					}
				}

				//- - - - - - - - - - - - - - - 
				//- Envolver el input
				wrapper.className = 'currentInput' + status;
				input.wrap( wrapper );
				input.parent().append('<label class="currentInput-label" >'+label+'</label>');

			};

			_init();
		},

		reset: function( item ){
			item.closest('.listo').removeClass('listo');
		},

		updateCheck : function(element){
			var
			_init = function(){
				var
				item;

				for( var i=0, lg=element.length; i<lg; i++ ){
					item = $(element[i]);

					if( !item.closest('.flCh').length ){
						_makeCheck( item );
					}
				}
			};

			var
			_makeCheck = function( input ){

				var
				boxy = document.createElement( 'SPAN' ),
				clase;

				//- - - - - - - - - - - - - - - 
				//- Envolver el input
				boxy.className = 'flCh';
				if(input.attr('type') == 'radio'){
					clase = 'lbRd';
				}else{
					clase = 'lbCh';
				}
				input.parents('label').addClass(clase)
				input.parents('label').append('<span class="flCh"></span>');

			};

			_init();	
		}

	};

	var
	startAll = (function(){
		var inputs = $('.withLabel');
		//inputs = $( '[type=text], [type=email], textarea, .customSelect' ).not('.noLabel');
		var checks = $('[type=checkbox], [type=radio]')
	
		for( var i=inputs.length-1; i>-1; i--  ){
			_namespace.update(  $(inputs[i])  );
		}

		for( var i=checks.length-1; i>-1; i--  ){
			_namespace.updateCheck(  $(checks[i])  );
		}

		$.fn.extend({
			updateInput : function(){
				_namespace.update(  $(this)  );
			}
		});

	})();

	return _namespace;

})();

//alert(123);

///- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//-NUEVO
var
placeholders = (function(){

	//- GLOBALS
	var
	fields = '[type=text],[type=email],[type=password], textarea';

	//- - - - - - - - - - - -
	//- PUBLIC METHODS
	//- - - - - - - - - - - -
	var
	init = function(){

		var
		items = $( fields ),
		el;

		for( var i=0, lg= items.length; i<lg; i++ ){
			el = $(items[i]);

			if( el.val().replace(/\s/g,'') == '' ){
				el.val( el.attr('data-name') );
			}
		}

		$('body').on('focusin', fields, function(e){
			var that = $( this );

			if( that.attr( 'data-name' ) == undefined ){
				that.attr( 'data-name' ) = that.val();
			}
			if( that.val() == that.attr( 'data-name' )  && that.attr('readonly') == undefined ){
				that.val('');
			}
		});


		$( 'body' ).on( 'focusout', fields, function( e ){
			var that = $( this );

			if( that.val(  ).replace( /\s/g,'' ).length == 0 ){
				that.val( that.attr( 'data-name' ) );
			}
		});
	};

	init();

})();

$.fn.extend({
	resetInput : function(){
		$(this).val('');
		$(this).trigger('blur');
	}
});



var
valForm = (function(){

	//- GLOBALS
	var
	ui_Form = {
		fields : 'textarea, [type=text], [type=email], [type=password], [type=email]',
		checks: '[type=radio], [type=checkbox]',
		selects: 'select',


		messages : {

			defaults : {
				required : 'Campo requerido',
				name     : 'Escribe tu nombre',
				lastname : 'Escribe tu apellido',
				number   : 'Sólo números enteros',
				decimal  : 'Números enteros o decimales',
				email    : 'Use un correo electrónico válido',
				select   : 'Selecciona una opción',
				group    : 'Selecciona al menos una opción',
				confirm  : 'Los campos no coinciden',
				tel      : 'Teléfono invalido'

			},
			en : {
				required : 'Required field',
				name     : 'Name or last name',
				lastname : 'Last name',
				number   : 'Only integer alowed',
				decimal  : 'Only decimal number alowed',
				email    : 'Invalid email',
				select   : 'Select an option',
				group    : 'At least, select an option',
				confirm  : 'Los campeishon no coinciden',
				tel      : 'Invalid Phone number'
			}
		},

		config : {
			tips : true
		}
	};

	var
	valueTypes = {

		name: {
			regx: /^[a-záéíóúñ ']+$/gi
		},
		lastname: {
			regx: /^[a-záéíóúñ ']+$/gi
		},
		email: {
			regx: /^[^\s]*[a-zA-Z0-9\._-]{1,}@([a-zA-Z0-9]{2,})+(\.[a-zA-Z0-9]{2,})+$/g
		},
		number: {
			regx: /^-?[0-9]+$/g
		},
		decimal:{
			regx: /^-?[0-9]*.?[0-9]+$/gi
		},
		tel:{
			regx : /^([0-9][\s\.-]?){10, 15}/g
		},
		rfc:{
			regx: /^[A-Z,Ñ,&amp;]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?/gi
		},
		curp:{
			regx: /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/gi
		},
		contrasena:{
			regx: /^[A-Za-z0-9]{8,12}$/g
		}
	};

	var
	_messages = ui_Form.messages,
	ui_lang   = $('html').attr('lang'),
	focusItem = null,
	send      = true;




	var
	addMessage = function( item, classe ){
		var
		message = '';

		try{
			message = _messages[ ui_lang ][ classe ];
		}catch(err){
			message = _messages.defaults[ classe ];
		}

		if( message == undefined ){

			if( item.hasClass('required') ){
				if( _messages[ ui_lang ] !== undefined && _messages[ ui_lang ].required !== undefined ){
					message = _messages[ ui_lang ].required;
				}else{
					message = _messages.defaults.required;
				}

			}else{
				message = 'Mensaje de la clase <strong>"'+classe+'"</strong> en el idioma <strong>"'+ui_lang+'"</strong> no esta definido.'
			}
		}


		if( !item.parent().hasClass('hintTip') ){
			item.wrap( '<span class="hintTip error" />' );
			item.parent().append( '<span class="hintTip-text" >'+ message +'</span>' );

			/* PROYECTO: MAS SALUD */
			var fechaIco = item.parents('form').find('.hasDatepicker'),
				icoCal;
				for(d=0; d<fechaIco.length; d++){
					if($(fechaIco[d]).hasClass('required')){
						icoCal = $(fechaIco[d]).parents('.currentInput').find('.fecha-gris');
						icoCal.addClass('error');
					}
				}

			/* TERMINA MAS SALUD */
		}else{
			item.parent().addClass('error');
			item.parent().find('> .hintTip-text').html( message );
		}
		if( !focusItem ){
			focusItem = item;
			item.trigger('focus');
		}

		send = false;
	};


	//- - - - - - - - - - - -
	//- PUBLIC METHODS
	//- - - - - - - - - - - -
	var
	_namespace = {

		messages : function( options ){
			var
			_messages =  ui_Form.messages;

			for( var key in options ){

				if( _messages[ key ] == undefined ){
					_messages[ key ] = options[ key ];
				}else{
					for( var subKey in options[ key ] ){
						_messages[ key ][ subKey ] = options[ key ][ subKey ];
					}
				}
			}
		},

		class : function( options ){
			for( var key in options ){

				if( valueTypes[ key ] == undefined ){
					valueTypes[ key ] = options[ key ];
				}else{
					for( var subKey in options[ key ] ){
						valueTypes[ key ][ subKey ] = options[ key ][ subKey ];
					}
				}
			}
		},


		validate : function( options ){


			var
			_opt = $.extend(
				{},
				{
					form : null,
					success: null
				},
				options
			);

			//- - - - - - - - - - - -
			//- INPUT and SUBMIT
			//- - - - - - - - - - - -
			var
			_startEvents = function(){
				if( !_opt.form ){
					throw 'Error: "form" not defined!';
					return false;
				}


				//- - - - - - - - - - - -
				//- PREVENT NUMBERS
				//- - - - - - - - - - - -
				_opt.form.on( 'keydown', ui_Form.fields, function(e){
					var
					item = $(this);

					if( item.hasClass('noNumbers') ){
						if( e.keyCode > 47 && e.keyCode < 58 ){
							e.preventDefault();
						}
					}

					if( item.hasClass('onlyNumbers') ){
						//96 105
						//47 58
						if( e.keyCode <= 47 || e.keyCode >= 191 ){
							if( e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 ){
								e.preventDefault();
							}
						}
						if( e.keyCode >= 58 && e.keyCode <=95 ){
							e.preventDefault();
						}


						// if( e.keyCode <= 47 || e.keyCode >= 58 ){
						// 	if( e.keyCode !== 8 && e.keyCode !== 190 ){
						// 		e.preventDefault();
						// 	}
						// }
					}
				});

				//- - - - - - - - - - - -
				//- CHECK FIELDS
				//- - - - - - - - - - - -
				_opt.form.on( 'keyup', ui_Form.fields, function(e){
					var
					item = $(this),
					valueType = _getValueType( item );

					_validateFields( item  );
					// if( valueType.length > 0 || item.attr('data-confirm') !== undefined ){
					// 	_validateFields( item  );
					// }
				});

				//- - - - - - - - - - - -
				//- CUSTOM SELECT
				//- - - - - - - - - - - -
				_opt.form.on( 'change', ui_Form.selects, function(e){
					var
					item = $(this),
					valueType = _getValueType( item );

					_validateFields( item, 'select'  );
					// if( valueType.length > 0 || item.attr('data-confirm') !== undefined ){
					// 	_validateFields( item  );
					// }
				});
				// $(item.closest('.hintTip')).removeClass('error');

				//- - - - - - - - - - - -
				//- CHECKBOX & RADIOS
				//- - - - - - - - - - - -
				_opt.form.on( 'change', ui_Form.checks, function(e){
					var
					item = $(this),
					valueType = _getValueType( item );

					_validateFields( item, 'checks' );
					// if( valueType.length > 0 || item.attr('data-confirm') !== undefined ){
					// 	_validateFields( item  );
					// }
				});
				//- - - - - - - - - - - -
				//- CHECK FULL FORM
				//- - - - - - - - - - - -
				_opt.form.on( 'submit', function(e){
					e.preventDefault();
					_validateForm();
				});

			};

			//- - - - - - - - - - - -
			//- Return the "class" to evaluate
			//- - - - - - - - - - - -
			var
			_getValueType = function( item ){
				var
				classes = [];

				for( key in valueTypes ){
					if( item.hasClass( key ) ){
						classes.push( key );
					}
				}

				return classes;
			};

			//- - - - - - - - - - - -
			//- VALIDATE FIELDS
			//-	* defined in ui_Form.fields
			//- - - - - - - - - - - -
			var
			_validateFields = function( item, classes  ){
				var
				str  = item.val(),
				valueType = classes || _getValueType( item ),
				dataConfirm = item.attr('data-confirm'),
				confirmValue;

				if(valueType == 'select'){
					if(item.val() != ''){
						item.parents('.hintTip').removeClass('error');
						return false;
					} else {
						item.parents('.hintTip').addClass('error');
						return false;
					}
				} else if(valueType == 'checks'){
					if(item.is(':checked')){
						$(item.closest('.hintTip')).removeClass('error');
						return false;
					} else{
						$(item.closest('.hintTip')).addClass('error');
						return false;
					}
				} else if( valueType.length == 0 ){
					valueType = ['required'];
				}

				if( item.val() == '' && item.hasClass('required') == false ){
					item.parent().removeClass('error');
					return false;
				}
				if( item.hasClass('required') == true && item.val() == item.attr('data-name') ){
					addMessage( item, valueType );
					return false;
				}

				if( !dataConfirm ){
					for( var i=0, lg= valueType.length; i<lg; i++  ){
						if(valueType[i] == 'required'){
							if( item.val() == item.attr('data-name') ){
								addMessage( item, valueType[i] );
								break;
							}else{
								item.parent().removeClass('error');
							}

						}else{

							if( str.match( valueTypes[valueType[i]].regx ) === null ){
								addMessage( item, valueType[i] );
								break;
							}else{
								item.parent().removeClass('error');
							}
						}
					}
				}

				if( dataConfirm ){
					confirmValue = $('#' + dataConfirm ).val();
					item.val() !== confirmValue? addMessage( item, 'confirm' ) : item.parent().removeClass('error');
				}
			};

			//- - - - - - - - - - - -
			//- VALIDATE RADIO / CHECKBOX
			//- - - - - - - - - - - -
			var
			_validateOptions = function( item ){
				if( !item.is(':checked') ){
					addMessage( item.closest('label'), 'required' );
				}else{
					$(item.closest('.hintTip')).removeClass('error');
				}
			};

			//- - - - - - - - - - - -
			//- VALIDATE GROUPS OF RADIO / CHECKBOX
			//- - - - - - - - - - - -
			var
			_validateGroups = function( item ){
				var
				checked = item.find(':checked'),
				label   = item.find('.group-label');

				if( !checked.length && item.hasClass('required') ){
					addMessage( label, 'group' );
				}else{
					label.closest('.hintTip').removeClass('error');
				}
			};

			//- - - - - - - - - - - -
			//- VALIDATE CUSTOM ELEMENTS
			//- - - - - - - - - - - -
			var
			_validateCustom = function( item ){
				var
				valueType = _getValueType( item ),
				label     = item.find('.group-label'),
				element   = item;

				if( valueTypes[ valueType ].custom( item ) == false ){
					if( label.length ){
						element = label;
					}
					addMessage( element, valueType );
				}
			};

			//- - - - - - - - - - - -
			//- VALIDATE CUSTOMSELECT
			//- - - - - - - - - - - -
			var
			_validateSelects = function( item ){
				var
				custom = item.closest('.customSelect');

				if( item.val() == '' || item.val() == null ){
					addMessage( custom, 'select' );
				}else{
					item.closest('.hintTip').removeClass('error');
				}
			};

			//- - - - - - - - - - - -
			//- VALIDATE ON SUBMIT
			//- - - - - - - - - - - -
			var
			_validateForm = function( form ){
				send = true;

				var
				elements     = _opt.form.find('fieldset').not('.noValidate'),
				inputFields  = elements.find( ui_Form.fields ),
				inputOptions = elements.find( '[type=radio], [type=checkbox]' ),
				groups       = elements.find( '.group-input' ),
				selects      = elements.find( 'select' ),
				customs      = '';


				focusItem = null;

				//- Campos y textarea
				for( var i=0, lg= inputFields.length; i<lg; i++ ){
					if( $(inputFields[i]).hasClass('required')  ){
						_validateFields( $(inputFields[i]) );
					}
				}

				//- Checkbox y Radio
				for( var i=0, lg= inputOptions.length; i<lg; i++ ){
					if( $(inputOptions[i]).hasClass('required')  ){
						_validateOptions( $(inputOptions[i]) );
					}
				}

				//- Grupos de Checkbox y Radio
				for( var i=0, lg= groups.length; i<lg; i++ ){
					if( $(groups[i]).hasClass('required')  ){
						_validateGroups( $(groups[i]) );
					}
				}

				//- Selects / customSelect
				for (var i = 0, lg=selects.length; i<lg; i++) {
					if( $(selects[i]).hasClass('required')  ){
						_validateSelects( $(selects[i]) );
					}
				};


				//- External validations
				for( var key in valueTypes ){
					if( valueTypes[ key ].custom !== undefined && typeof valueTypes[ key ].custom === 'function' ){
						customs += '.'+ key +' ';
					}
				}
				customs = elements.find( customs );

				for (var i = 0, lg=customs.length; i<lg; i++) {
					_validateCustom( $(customs[i]) );
				};


				if( send ){
					if( _opt.success !== null && typeof _opt.success === 'function' ){
						_opt.success.call();
					}else{
						_opt.form.off( 'submit');
						_opt.form.submit();
					};
				}
			};


			//- - - - - - - - - - - -
			_startEvents();

		}
	};

	return _namespace;

})();






// valForm.messages({
// 	es : {
// 		tel : 'Phone number 10 digits',
// 		telx : 'Fecha no válida'
// 	}
// });


// var
// validarFecha = function( item ){
// 	console.info('validando fecha externo');

// 	return false
// };

// valForm.class({
// 	tel : {
// 		regx : /^[0-9]{10}/g
// 	},
// 	telx : {
// 		custom: validarFecha
// 	}
// })

// valForm.validate({
// 	form: $('#form'),
// 	success: function(){
// 		console.info('por ajax?');
// 	}
// })

/**
	* [[Archivo global del proyecto]]
	* @private
	* @author Erika Contreras <erikaecv@gmail.com>
	*/
(function(){
	var init = function(){
		var msjConf = 'Instalación correcta de main.js';
		console.info(msjConf);
	};

	init();
})();