$(document).ready(function(){

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
      error:  function() {
         alert('An error occurred');
      },
      dataType: 'json',
      success: function(data) {
        $('#artist_list').append('<div class="artist" id=artist_'+ data[0].id +'><p class="artist_name">' + data[0].name + '</p><p class="artist_years">' + data[0].years + '</p><div class="remove_artist">X</div><div class="edit_artist">Edit</div></div>');
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
        dataType: 'json',
        error:  function() {
          alert('An error occurred');
        },
        success: function(data) {
          $(self).parent().remove();
        }
      });
    }
  });

  // remove a work
  $('body').on('click', '.remove_work', function(event){
    var result = confirm("Delete?");
    if (result) {
      var id = $(this).parent().attr('id').split('_')[1];
      event.preventDefault();
      var self = this;
      $.ajax({
        type: "DELETE",
        url: '/work?id=' + id,
        dataType: 'json',
        error:  function() {
          alert('An error occurred');
        },
        success: function(data) {
          $(self).parent().remove();
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
    var submission_url = '/artist/' + artist_id +'/new?title=' + title + "&year=" + year + "&url=" + url + "&artist_id=" + artist_id;
    $.ajax({
      type: "POST",
      url: submission_url,
      error:  function() {
         alert('An error occurred');
      },
      dataType: 'json',
      success: function(data) {
        $('<div class="work" id="work_' + data[0].id +'"><img src =' + data[0].url + ' width="200px"</img><p class="title">' + data[0].title + '</p><p class="year">' + data[0].year + '</p><p class="remove_work">X</p><p class="edit_work">Edit</p></div>').insertBefore('#new_work_form');
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
  $('.edit_artist_form').remove();
  if($(this).hasClass('editing')){
    $('.artist#artist_' + id).append('<form class="edit_artist_form"><input type="hidden" value=' + id + '><input type="text" placeholder="name" value="' + name + '"><input type="text" placeholder="years" value="' + years + '"><button>');    
  }
 });

 //display a work's edit form
 $('body').on('click', '.edit_work', function(event){
  event.preventDefault();
  var id = $(this).parent().attr('id').split('_')[1];
  var url = $(this).siblings('img').attr('src');
  var title = $(this).siblings('.title').text();
  var year = $(this).siblings('.year').text();
  $(this).toggleClass('editing');
  $('.edit_work_form').remove();
  if($(this).hasClass('editing')){
    $('.work#work_' + id).append('<form class="edit_work_form"><input type="hidden" value=' + id + '><input type="text" placeholder="year" value=' + year + '><input type="text" placeholder="title" value="' + title + '"><input type="url" placeholder="url" value=' + url + '><button></form>');    
  }
 });

 //update an artist
 $('body').on('click', '.edit_artist_form button', function(event){
  var image_src = $(this).parent().siblings('img').attr('src');
  var new_image = '';
  if(image_src){
    new_image = '<img src=' + image_src + ' width="100px">'
  }
  event.preventDefault();
  var form_results = [];
  $('.edit_artist_form *').filter(':input').each(function(){
    form_results.push($(this).val());
  });
  var id = form_results[0];
  var name = form_results[1];
  var years = form_results[2];
  $.ajax({
    type: "PUT",
    url: '/artist/' + form_results[0] + "?artist_id=" + id + '&artist_years=' + years + '&artist_name=' + name,
    error:  function() {
       alert('An error occurred');
    },
    dataType: 'json',
    success: function(data) {
      $('#artist_' + id).empty();
      $('#artist_' + id).append('<p class="artist_name">' + data[0].name + '</p>' + new_image + '<p class="artist_years">' + data[0].years + '</p><div class="remove_artist">X</div><div class="edit_artist">Edit</div>');
    }
  });
 });

 //update a work
 $('body').on('click', '.edit_work_form button', function(event){
  var work_id = $(this).parent().parent().attr('id');
  event.preventDefault();
  var form_results = [];
  $('.edit_work_form *').filter(':input').each(function(){
    form_results.push($(this).val());
  });
  var id = form_results[0];
  var year = form_results[1];
  var title = form_results[2];
  var url = form_results[3];
  $.ajax({
    type: "PUT",
    url: '/work/' + form_results[0] + "?work_id=" + id + '&work_year=' + year + '&work_title=' + title + '&work_url=' + url,
    error:  function() {
       alert('An error occurred');
    },
    dataType: 'json',
    success: function(data) {
      $('#' + work_id).empty();
      $('#' + work_id).append('<img src =' + data[0].url + ' width="200px"</img><p class="title">' + data[0].title + '</p><p class="year">' + data[0].year + '</p><p class="remove_work">X</p><p class="edit_work">Edit</p>');
    }
  });
 });

 // display an artist's works
 $('body').on('click', '.artist .artist_name', function(event){
    var id = $(this).parent().attr('id').split('_')[1];
    var artistAPI = "/artist/" + id;
    var callOptions = {
        format: "json"
    };
    function displayWorks(data) {
      var art_list = '';
      data.forEach(function(work){
        art_list += '<div class="work" id= work_' + work.id + '><img src =' + work.url + ' width="200px"</img><p class="title">' + work.title + '</p><p class="year">' + work.year + '</p><p class="remove_work">X</p><p class="edit_work">Edit</p></div>';
      });
      art_list += "<form id='new_work_form'><input type ='text' placeholder='year' id='work_year'><input type ='text' placeholder='title' id='work_title'><input type ='text' placeholder='url' id='work_url'><input type ='hidden'  id='work_artist_id' value=" + id + "><button></form>"
      $('#art_list').html(art_list);
    }
    $.getJSON(artistAPI, callOptions, displayWorks);
  });
});
