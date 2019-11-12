var
    customFields = (function() {

        //- - - - - - - - - - - - - - -
        //- EVENTOS
        //- - - - - - - - - - - - - - -
        var
            _inputEvents = (function() {
                var
                    fields = '[type=text], [type=email], [type=password], textarea, [type=tel]';

                //- - - - - - - - - - - - - - -
                //- Muestra el label
                $('body').on('focus', fields, function(e) {
                    $(this).closest('.currentInput').addClass('activo');

                    if ($(this).hasClass('password')) {
                        var that = $(this);
                        $(that).removeAttr("type").prop('type', 'password');
                    }
                });


                //- - - - - - - - - - - - - - -
                //- Muestra / Esconde el label al validar
                $('body').on('blur', fields, function(e) {
                    var
                        that = $(this),
                        holder = that.closest('.currentInput');



                    if (that.val() !== that.attr('data-name') && that.val().length >= 1) {
                        holder.addClass('listo');
                    } else {
                        holder.removeClass('listo');
                        if ($(that).hasClass('password')) {
                            $(that).removeAttr("type").prop('type', 'text');
                        }
                    }

                    holder.removeClass('activo');
                });


                $('body').on('change', 'select', function(e) {
                    var
                        that = $(this),
                        holder = that.parents('.customSelect').parents('.currentInput');

                    // console.info('if-----');
                    // console.info(that.val(), that.attr('data-name'));
                    if (isiPhone()) {
                        if (that.val() != '' && that.val().length >= 1) {
                            that.parents('.currentInput').addClass('listo');
                        } else {
                            that.parents('.currentInput').removeClass('listo');
                        }
                    } else {
                        if (that.val() != that.attr('data-name') && that.val().length >= 1) {
                            holder.addClass('listo');
                        } else {
                            holder.removeClass('listo');
                        }

                    }

                    return false;
                });


                //- - - - - - - - - - - - - - -
                //- .customSelect
                $('body').on('change', 'select', function(e) {
                    var
                        that = $(this),
                        holder = that.closest('.currentInput');

                    if (that.val() !== '') {
                        holder.addClass('listo');
                    } else {
                        holder.removeClass('listo');
                    }
                });
                $('body').on('blur', 'select', function(e) {
                    var
                        that = $(this),
                        holder = that.closest('.currentInput');

                    setTimeout(function() {
                        holder.removeClass('activo');
                    }, 200);

                });


            })();


        //- - - - - - - - - - - - - - -
        //- PÚBLICO
        //- - - - - - - - - - - - - - -
        _namespace = {

            update: function(element) {

                var
                    _init = function() {
                        var
                            item;

                        for (var i = 0, lg = element.length; i < lg; i++) {
                            item = $(element[i]);

                            if (!item.closest('.currentInput').length) {
                                _makeInput(item);
                            } else {
                                //item.closest('.currentInput').addClass('listo');
                                //Aquiiiiiiii
                            }
                        }
                    };

                var
                    _makeInput = function(input) {

                        //console.info(input);

                        var
                            wrapper = document.createElement('SPAN'),
                            label = input.attr('data-name'),
                            status = '';

                        //- - - - - - - - - - - - - - -
                        //- Validar si esta lleno
                        if (input.val() != label) {
                            status = ' listo';
                        }


                        //- - - - - - - - - - - - - - -
                        //- Validar si es un customSelect
                        if (input.hasClass('customSelect')) {
                            label = $(input.find('select')).attr('data-name');
                            if ($(input.find('select')).val() == '') {
                                status = '';
                            }
                        }


                        if (input.hasClass('maskSelect')) {
                            console.info('label aqui: ', input);
                            label = $(input).attr('data-name');
                            if ($(input).val() == '') {
                                status = '';
                            }
                        }

                        wrapper.className = 'currentInput' + status;
                        input.wrap(wrapper);
                        input.parent().append('<label class="currentInput-label" >' + label + '</label>');



                    };

                _init();
            },

            reset: function(item) {
                item.closest('.listo').removeClass('listo');
            },

            updateCheck: function(element) {
                var
                    _init = function() {
                        var
                            item;

                        for (var i = 0, lg = element.length; i < lg; i++) {
                            item = $(element[i]);

                            if (!item.closest('.flCh').length) {
                                _makeCheck(item);
                            }
                        }
                    };

                var
                    _makeCheck = function(input) {

                        var
                            boxy = document.createElement('SPAN'),
                            clase;

                        //- - - - - - - - - - - - - - -
                        //- Envolver el input
                        boxy.className = 'flCh';
                        if (input.attr('type') == 'radio') {
                            clase = 'lbRd';
                        } else {
                            clase = 'lbCh';
                        }
                        input.parents('label').addClass(clase)
                        input.parents('label').append('<span class="flCh"></span>');

                    };

                _init();
            }

        };

        var
            startAll = (function() {
                var inputs = $('.withLabel');
                //inputs = $( '[type=text], [type=email], textarea, .customSelect' ).not('.noLabel');
                var checks = $('[type=checkbox], [type=radio]')

                for (var i = inputs.length - 1; i > -1; i--) {
                    _namespace.update($(inputs[i]));
                }

                for (var i = checks.length - 1; i > -1; i--) {
                    _namespace.updateCheck($(checks[i]));
                }

                $.fn.extend({
                    updateInput: function() {
                        _namespace.update($(this));
                    }
                });

            })();

        return _namespace;

    })();

//alert(123);