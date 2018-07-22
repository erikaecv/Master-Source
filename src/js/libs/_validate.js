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
				//that.attr( 'data-name' ) = that.val();
				var valueData = that.val();
				that.attr('data-name', valueData);
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
