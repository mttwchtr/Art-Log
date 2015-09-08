$(document).ready(function(){
 // display an artist's works
 $('.artist_name').click(function(){
    var id = $(this).attr('id');
    var artistAPI = "/artist/" + id;
    var callOptions = {
        format: "json"
    };
    function displayWorks(data) {
      var art_list = '';
      data.forEach(function(work){
        art_list += '<img src =' + work.url + ' width="200px"</img>';
      });
      art_list += "<form><input type ='text' value='year' id='work_year'><input type ='text' value='title' id='work_title'><input type ='text' value='url' id='work_url'><input type ='hidden'  id='work_artist_id' value=" + id + "><button></form>"
      $('#art_list').html(art_list);
    }
    $.getJSON(artistAPI, callOptions, displayWorks);
  });

  // add a new artist
  $('#artist_list form button').click(function(event){
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
         $('#artist_name').val('');
         $('#artist_years').val('');
         $('#artist_list').append('<p class="artist_name" id=' + data[0].id + '>' + data[0].name + '</p><img width="100px"><p>' + data[0].years + '</p>');
      }
    });
  });

  // add a new artist's work
  $('body').on('click', '#art_list form button', function(event){
    event.preventDefault();
    var year = $('#work_year').val();
    var title = $('#work_title').val();
    var url = $('#work_url').val();
    var artist_id = $('#work_artist_id').val();
    var submission_url = '/artist/' + artist_id +'/new?_title=' + title + "&year=" + year + "&url=" + url + "&artist_id=" + artist_id;
    $.ajax({
      type: "POST",
      url: submission_url,
      error:  function() {
         alert('An error occurred');
      },
      dataType: 'json',
      success: function(data) {
        alert('success!');
      }
    });
  });
});
