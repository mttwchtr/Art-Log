$(document).ready(function(){

  $('body').on('click', '#artist_view_type', function(event){
    if($(this).text() === 'Artists +'){
      $(this).text('Artists -')
    } else {
      $(this).text('Artists +')
    }
    event.preventDefault();
    $('.artist_name').siblings().toggle();
  });

  $('body').on('click', '#clear', function(event){
    event.preventDefault();
    $('#art_list').empty();
    $('p').removeClass('chosen');
  });

  $('body').on('click', '#work_view_type', function(event){
    if($(this).text() === 'Works -'){
      $(this).text('Works +')
    } else {
      $(this).text('Works -')
    }
    event.preventDefault();
    $('#art_list img').siblings().toggle();
  });
});