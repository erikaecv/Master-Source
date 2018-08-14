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
