/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/people',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(fio, birthday, office) {
            let ajax_options = {
                type: 'POST',
                url: 'api/people',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fio': fio,
                    'birthday': birthday,
                    'office': office
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(fio, birthday, office) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/people/' + birthday,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fio': fio,
                    'birthday': birthday,
                    'office': office
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(birthday) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/people/' + birthday,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $person_id = $('#person_id'),   //////////
        $fio = $('#fio'),
        $birthday = $('#birthday'),
        $office = $('#office');

    // return the API
    return {
        reset: function() {
            $fio.val('').focus();
            $birthday.val('');
            $office.val('');
        },
        update_editor: function(fio, birthday, office) {
            $fio.val(fio).focus();
            $birthday.val(birthday);
            $office.val(office);
        },
        build_table: function(people) {
            let rows = ''

            // clear the table
            $('.people table > tbody').empty();

            // did we get a people array?
            if (people) {
                for (let i=0, l=people.length; i < l; i++) {
                    rows += `<tr><td class="id">${people[i].person_id}</td><td class="fio">${people[i].fio}</td><td class="birthday">${people[i].birthday}</td><td class="office">${people[i].office}</td><td>${people[i].timestamp}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $person_id = $('#person_id'),              ////////////
        $fio = $('#fio'),                       // поменялось местами
        $birthday = $('#birthday'),
        $office = $('#office');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(person_id, fio, birthday, office) {
        return person_id !== "" && fio !== "" && birthday !== "" && office !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let person_id = $person_id.val(),
            fio = $fio.val(),
            office = $office.val(),
            birthday = $birthday.val();

        e.preventDefault();

        if (validate(person_id, fio, birthday, office )) {
            model.create(person_id, fio, birthday, office)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let person_id = $person_id.val(),
            fio = $fio.val(),
            birthday = $birthday.val(),
            office = $office.val();
;

        e.preventDefault();

        if (validate(person_id, fio, birthday, office )) {
            model.update(person_id, fio, birthday, office )
        } else {
            alert('Problem fio input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let fio = $fio.val();

        e.preventDefault();

        if (validate('placeholder', fio)) {
            model.delete(fio)
        } else {
            alert('Problem fio input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            person_id,              //////////////
            fio,
            birthday,
            office;

        person_id = $target
            .parent()
            .find('td.person_id')
            .text();

        fio = $target
            .parent()
            .find('td.fio')
            .text();

        office = $target
            .parent()
            .find('td.birthday')
            .text();

        birthday = $target
            .parent()
            .find('td.office')
            .text();

        view.update_editor(fio, birthday,office );
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));

