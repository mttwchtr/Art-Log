$(document).ready(function(){

  // display 10 random works
  $('body').on('click', '#random', function(event){
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: 'works/random',
      error:  function() {
         alert('An error occurred');
      },
      dataType: 'json',
      success: function(data) {
        $('#work_list').empty();
        $('p').removeClass('chosen');
        var id_length = data.length;
        var limit = Math.min(10, id_length);
        var random_indices = [];
        while(random_indices.length < limit){
          var new_rand = Math.floor(Math.random() * id_length); 
          if(random_indices.indexOf(new_rand) === -1) {
            random_indices.push(new_rand);
          }
        }
        var rand_work_html = "";
        random_indices.forEach(function(index){
          var ele = data[index];
          rand_work_html += '<div class="work" id="work_' + ele.id + '"><p>' + ele.title + '</p><a href="#artist_' + ele.artist_id + '">' + ele.name + '</a><br><img src =' + ele.url + ' height="200px" /></div>';
        });
        $('#work_list').append(rand_work_html);
        if($('#work_view_type').text() === 'Works +'){
          $('#work_list img').siblings().hide();
        }
      }
    });
  });

  // add a new artist
  $('body').on('click', '#new_artist_form button', function(event){
    var id = $(this).parent().attr('id').split('_')[1];
    event.preventDefault();
    var name = $('#artist_name').val();
    var years = $('#artist_years').val();
    var url = '/artists/new?artist_name=' + name + "&artist_years=" + years;
    $.ajax({
      type: "POST",
      url: url,
      error:  function(err) {
        display_error(err.responseText, 'new_artist_form');
      },
      dataType: 'json',
      success: function(data) {
        data = data[0];
        $('#artist_body').append('<div class="artist" id=artist_'+ data.id +'><p class="artist_name">' + data.name + '</p><p class="artist_years">' + data.years + '</p><img width="100px"><br><span class="edit_artist">Edit</span><span class="remove_artist">Delete</span></div>');
        $('#new_artist_form').trigger("reset");
        if($('#artist_view_type').text() === 'Artists +'){
          $('#artist_' + data.id + ' .artist_name').siblings().hide();
        }
      }
    });
  });

  // remove an artist
  $('body').on('click', '.remove_artist', function(event){
    var result = confirm("Delete?");
    if (result) {
      var id = $(this).parent().attr('id').split('_')[1];
      event.preventDefault();
      var self = this;
      $.ajax({
        type: "DELETE",
        url: '/artist?id=' + id,
        error:  function(err) {
          alert(error.statusText);
        },
        success: function() {
          $(self).parent().remove();
          if(id == $('#work_list input[type=hidden]').val()){
            $('#work_list').empty();
          }
        }
      });
    }
  });

  // remove a work
  $('body').on('click', '.remove_work', function(event){
    var result = confirm("Delete?");
    if (result) {
      var id = $(this).parent().attr('id').split('_')[1];
      var src = $('#work_' + id + ' img').attr('src');
      event.preventDefault();
      var self = this;
      $.ajax({
        type: "DELETE",
        url: '/work?id=' + id,
        dataType: 'text',
        error:  function() {
          alert('An error occurred');
        },
        success: function() {
          $(self).parent().remove();
          var artist_id = $('#work_list input[type=hidden]').val();
          var artist_image_src = $('#artist_' + artist_id + ' img').attr('src');
          if($('.work').length === 0){
            $('#artist_' + artist_id + ' img').remove();
            $('<img width="100px">').insertAfter('#artist_' + artist_id + ' .artist_years');
          } else if(src === artist_image_src) {
            var new_src = $('.work img').first().attr('src');
            $('#artist_' + artist_id + ' img').attr('src', new_src);
          }
        }
      });
    }
  });

  // add a new artist's work
  $('body').on('click', '#new_work_form button', function(event){
    event.preventDefault();
    var year = $('#work_year').val();
    var title = $('#work_title').val();
    var url = $('#work_url').val();
    var artist_id = $('#work_artist_id').val();
    var submission_url = '/artist/' + artist_id +'/works/new?title=' + title + "&year=" + year + "&url=" + url + "&artist_id=" + artist_id;
    $.ajax({
      type: "POST",
      url: submission_url,
      error:  function(err) {
        display_error(err.responseText, 'new_work_form');
      },
      dataType: 'json',
      success: function(data) {
        data = data[0];
        var src = $('#artist_' + artist_id + ' img').attr('src');
        if(!src) {
          $('#artist_' + artist_id + ' img').attr('src', data.url);
        }
        $('#work_list').append('<div class="work" id= work_' + data.id + '><p class="work_title">' + data.title + '</p><p class="work_year">' + data.year + '</p><img src =' + data.url + ' height="200px"</img><br><span class="edit_work">Edit</span><span class="remove_work">Delete</span></div>');
        $('#new_work_form').trigger("reset");
        if($('#work_view_type').text() === 'Works +'){
          $('#work_' + data.id + ' img').siblings().hide();
        }
      }
    });
  });
 
 //display an artist's edit form
 $('body').on('click', '.edit_artist', function(event){
  event.preventDefault();
  var id = $(this).parent().attr('id').split('_')[1];
  var name = $(this).siblings('.artist_name').text();
  var years = $(this).siblings('.artist_years').text();
  $(this).toggleClass('editing');
  $('#edit_artist_form').remove();
  if($(this).hasClass('editing')){
    $('.artist#artist_' + id).append('<form id="edit_artist_form"><input type="hidden" value=' + id + '><input type="text" placeholder="name" value="' + name + '"><input type="text" placeholder="years" value="' + years + '"><button>');    
  }
 });

 //display a work's edit form
 $('body').on('click', '.edit_work', function(event){
  event.preventDefault();
  var id = $(this).parent().attr('id').split('_')[1];
  var url = $(this).siblings('img').attr('src');
  var title = $(this).siblings('.work_title').text();
  var year = $(this).siblings('.work_year').text();
  $(this).toggleClass('editing');
  $('#edit_work_form').remove();
  if($(this).hasClass('editing')){
    $('.work#work_' + id).append('<form id="edit_work_form"><input type="hidden" value=' + id + '><input type="text" placeholder="year" value="' + year + '"><input type="text" placeholder="title" value="' + title + '"><input type="url" placeholder="url" value=' + url + '><button></form>');    
  }
 });

 //update an artist
 $('body').on('click', '#edit_artist_form button', function(event){
  var image_src = $(this).parent().siblings('img').attr('src');
  var new_image = '<img width="100px">';
  if(image_src){
    new_image = '<img src=' + image_src + ' width="100px">'
  }
  event.preventDefault();
  var form_results = [];
  $('#edit_artist_form *').filter(':input').each(function(){
    form_results.push($(this).val());
  });
  var id = form_results[0];
  var name = form_results[1];
  var years = form_results[2];
  $.ajax({
    type: "PUT",
    url: '/artist/' + form_results[0] + "?artist_id=" + id + '&artist_years=' + years + '&artist_name=' + name,
    error:  function(err) {
      display_error(err.responseText, 'edit_artist_form');
    },
    dataType: 'json',
    success: function(data) {
      $('#artist_' + id).empty();
      $('#artist_' + id).append('<p class="artist_name">' + data[0].name + '</p><p class="artist_years">' + data[0].years + '</p>' + new_image + '<br><span class="edit_artist">Edit</span><span class="remove_artist">Delete</span>');
    }
  });
 });

 //update a work
 $('body').on('click', '#edit_work_form button', function(event){
  var work_id = $(this).parent().parent().attr('id');
  event.preventDefault();
  var form_results = [];
  $('#edit_work_form *').filter(':input').each(function(){
    form_results.push($(this).val());
  });
  var id = form_results[0];
  var year = form_results[1];
  var title = form_results[2];
  var url = form_results[3];
  $.ajax({
    type: "PUT",
    url: '/work/' + form_results[0] + "?work_id=" + id + '&work_year=' + year + '&work_title=' + title + '&work_url=' + url,
    error:  function(err) {
      display_error(err.responseText, 'edit_work_form');
    },
    dataType: 'json',
    success: function(data) {
      $('#' + work_id).empty();
      $('#' + work_id).append('<p class="work_title">' + data[0].title + '</p><p class="work_year">' + data[0].year + '</p><img src =' + data[0].url + ' height="200px"</img><br><span class="edit_work">Edit</span><span class="remove_work">Remove</span>');
    }
  });
 });

 // display an artist's works
 $('body').on('click', '.artist .artist_name', function(event){
    $('.artist_name').removeClass('chosen');
    $(this).addClass('chosen');
    var id = $(this).parent().attr('id').split('_')[1];
    $.ajax({
      type: "GET",
      url: "/artist/" + id,
      error:  function(err) {
         alert(err.status + " : " + err.statusText)
      },
      dataType: 'html',
      success: function(data) {
        var art_list = '';
        var artist_name = $('#artist_' + id + ' .artist_name').text();
        var artist_years = $('#artist_' + id + ' .artist_years').text();
        var art_list = '<div id="work_header"><a href= #artist_'+ id +'>' +  artist_name + ' | ' + artist_years + '</a>';
        art_list += "<form id='new_work_form'><input type ='text' placeholder='year' id='work_year'><input type ='text' placeholder='title' id='work_title'><input type ='text' placeholder='url' id='work_url'><input type ='hidden' id='work_artist_id' value=" + id + "><button></button></form></div><br>";
        art_list += "<div id='work_body'>" + data + "</div>";
        $('#work_list').html(art_list);
        if($('#work_view_type').text() === 'Works +'){
          $('#work_list img').siblings().toggle();
        }
      }
    });
  });

  // helpers 
  function display_error(err, form){
    $('#' + form).hide();
    $("<p class='displayed'></p>").insertBefore('#' + form);
    $('#' + form).prev('.displayed').text(err + " Click to remove message.");
  }

  $('body').on('click', '.displayed', function(){
    $(this).next().show();
    $(this).remove();
  });
});


    