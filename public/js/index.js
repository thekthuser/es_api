$(document).ready(function() {

  function wrap_pre(str) {
    return '<pre>' + str + '</pre';
  }

  function user_indices() {
    let username = $('#user_indices_input').val();
    $.getJSON('/users/' + username, function(data) {
      $('#content').html(wrap_pre(JSON.stringify(data, null, '\t')));
    }).fail(function(a) {
      $('#content').html(wrap_pre(a.status + ': ' + a.responseText));
    });
  }

  function search() {
    let search_index = $('#search_index_input').val();
    let search_term = $('#search_term_input').val();
    $.getJSON('/_search/' + search_index + '?q="' + search_term + '"', function(data) {
      $('#content').html(wrap_pre(JSON.stringify(data, null, '\t')));
    }).fail(function(a) {
      $('#content').html(wrap_pre(a.status + ': ' + a.responseText));
    });
  }

  $('#user_button').click(function() {
    $.getJSON('/users', function(data) {
      $('#content').html(wrap_pre(JSON.stringify(data, null, '\t')));
    });
  });

  $('#user_indices_button').click(function() {
    user_indices();
  });

  $('#user_indices_input').keyup(function(e) {
    if (e.keyCode == 13) {
      user_indices();
    }
  });

  $('#search_button').click(function() {
    search();
  });

  $('#search_index_input').keyup(function(e) {
    if (e.keyCode == 13) {
      search();
    }
  });

  $('#search_term_input').keyup(function(e) {
    if (e.keyCode == 13) {
      search();
    }
  });

  $('#populate_sql_button').click(function() {
    $.ajax({
      url: '/populate/sql',
      type: 'PUT',
      success: function(data) {
        $('#content').html(data);
      }
    });
  });

  $('#populate_es_button').click(function() {
    $.ajax({
      url: '/populate/es',
      type: 'PUT',
      success: function(data) {
        $('#content').html(data);
      }
    });
  });

});
