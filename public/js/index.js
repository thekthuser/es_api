$(document).ready(function() {

  function user_indices() {
    let username = $('#user_indices_input').val();
    $.getJSON('/users/' + username, function(data) {
      $('#content').html('<pre>' + JSON.stringify(data, null, '\t') + '</pre>');
    }).fail(function(a) {
      $('#content').html('<pre>' + a.status + ': ' + a.responseText + '</pre>');
    });
  }

  function search() {
    let search_index = $('#search_index_input').val();
    let search_term = $('#search_term_input').val();
    $.getJSON('/_search/' + search_index + '?q="' + search_term + '"', function(data) {
      $('#content').html('<pre>' + JSON.stringify(data, null, '\t') + '</pre>');
    }).fail(function(a) {
      $('#content').html('<pre>' + a.status + ': ' + a.responseText + '</pre>');
    });
  }

  $('#user_button').click(function() {
    $.getJSON('/users', function(data) {
      $('#content').html('<pre>' + JSON.stringify(data, null, '\t') + '</pre>');
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

  $('#search_term_input').keyup(function(e) {
    if (e.keyCode == 13) {
      search();
    }
  });

});
