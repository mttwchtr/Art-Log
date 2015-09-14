$(document).ready(function(){
  $('body').on('click', '#view_type', function(event){
    event.preventDefault();
    $('.artist_name').siblings().toggle();

  });
});