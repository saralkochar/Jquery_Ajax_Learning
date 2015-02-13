
$(function() {

  var $contacts = $('#contacts');
  var $name = $('#name');
  var $age= $('#age');

  var contactTemplate = $('#contact-template').html();

  function addContact (contact) {
    $contacts.append(Mustache.render(contactTemplate, contact));
  }

  $.ajax({

    type: 'GET',
    url: 'http://localhost:8080/api/staff/',
    success: function(contacts) {
      $.each(contacts, function(i, contact) {
      addContact(contact);
      });
    },
    error: function() {
      alert('error loading contacts');
    }
  });

  $('#add-contact').on('click', function() {

    var contact = {
      name: $name.val(),
      age: $age.val(),
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/api/staff/',
      data: contact,
      success: function(newContact) {
        addContact(newContact);
      },
      error: function() {
        alert('failed to add contact');
      },
    });


  });

  $contacts.delegate('.remove', 'click', function() {

    var $li= $(this).closest('li');
    var self =this; //never use this in success function, therefore to replace, turn into variable.

    $.ajax({
      type: 'DELETE',
      url: 'http://localhost:8080/api/staff/' + $(this).attr('data-id'),
      success: function (removeContact){
        $li.fadeOut(300, function() {
          $(this).remove();
        });
      },
      error: function () {
        alert('failed to remove')
      }

    });

    $contacts.delegate('.editContact', 'click', function () {
      var $li= $(this).closest('li');
      $li.find('input.name').val( $li.find('span.name').html() );
      $li.find('input.age').val( $li.find('span.age').html() );
      $li.addClass('edit');
    });

    $contacts.delegate('.cancelEdit', 'click', function () {
      $(this).closest('li').removeClass('edit');
    });

    $contacts.delegate('.saveEdit', 'click', function () {
      var $li=$(this).closest('li');
      var contact = {
        name: $li.find('input.name').val(),
        age: $li.find('input.age').val()
      };

      $.ajax({
        type: 'PUT',
        url: 'http://localhost:8080/api/staff/' + $li.attr('data-id'),
        data: contact,
        success: function(newContact) {
          $li.find('span.name').html(contact.name);
          $li.find('span.age').html(contact.age);
          $li.removeClass('edit');
        },
        error: function() {
          alert('error updating contact');
        }
      });

    });


  });

});
