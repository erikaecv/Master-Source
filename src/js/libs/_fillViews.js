fillView = function(options){
	
	var tempVista;
	if(typeof(options.view) == 'string'){
		//console.info('del js')
		tempVista = options.view;
	}else{
		tempVista = options.view[0].innerHTML;
		//console.info('del html')
	}


	var config = $.extend({
			data:null,
			view:'<p>Utiliza una vista válida</p>',
			opt:null
		},options),
		regX = /[\{\{\}\}]*/g, //  /[\[\]]*/g
		data = config.data,
		//tmpView = config.view,
		//tmpView = config.view[0].innerHTML,
		tmpView = tempVista,
		// arr = config.view.match( /\{\{([^ \{\}])+\}\}/g ),  // /\[([^ \[\]\{\}])+\]/g
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
