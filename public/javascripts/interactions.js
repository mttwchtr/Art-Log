$(document).ready(function(){
  
  // toggle artists' expanded / collapsed views
  $('body').on('click', '#artist_view_type', function(event){
    if($(this).text() === 'Artists +'){
      $(this).text('Artists -')
    } else {
      $(this).text('Artists +')
    }
    event.preventDefault();
    $('.artist_name').siblings().toggle();
  });

  // toggle works' expanded / collapsed views
  $('body').on('click', '#work_view_type', function(event){
    if($(this).text() === 'Works -'){
      $(this).text('Works +')
    } else {
      $(this).text('Works -')
    }
    event.preventDefault();
    $('#work_list img').siblings().toggle();
  });

  // clear the work_list
  $('body').on('click', '#clear', function(event){
    event.preventDefault();
    $('#work_list').empty();
    $('p').removeClass('chosen');
  });

  // expand the images
  $('body').on('click', '#work_list img', function(event){
    event.preventDefault();
    var id = $(this).parent().attr('id').split('_')[1];
    if(!$(this).hasClass('big')){
      $(this).addClass('big');
      $('#work_header').hide();
      $('#work_list .work:not(#work_' + id + ')').hide();
      $('#work_' + id).children().not('img').hide();
      $(this).css('height', '80vh');
    } else {
      $('#work_header').show();
      $(this).removeClass('big');
      $('#work_list .work').show();
      $(this).css('height', '200px');
      if($('#work_view_type').text() === 'Works -'){
        $('#work_' + id).children().show();
      }
    }
  });
});