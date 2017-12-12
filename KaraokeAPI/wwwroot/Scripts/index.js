﻿  var lines;
  var queue;

  $(document).ready( function() {
    $.get('/Scripts/songs.js', function(data) {
       lines = data.split("\n");
       get_query();
    }, 'text');

    $('#search').keypress(function(e) {
      if(e.which == 13) {
        get_match($('#search').val());
      };      
    });    

    setTimeout(get_queue, 2000);
  });

  function get_queue(){
    $.ajax({
      url: "/api/queue",
      success:function(result){
          if(result.length > 0){
            console.log(result);
            result.forEach(function(item){
              link = "<li>" + item.song + "<br />" + item.singer + "</li>";
              $("#queue").append(link);
            });
          }                
        },
        error:function(xhr,status,error){
          console.log("error:" + status);
        }
    });    

    setTimeout(get_queue, 2000);
  }

  function toggle(){
    $(".actions").slideUp();
    $(this.children[0]).slideDown();
  }

  function queue_song(){
    event.preventDefault();
    event.stopPropagation();

    swal({
      title: "Who the heck are you?",
      text: $(this).data("song"),
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "Write your name!",
      html: true, 
      data: $(this).data("song")
    },
    function(inputValue){
      if (inputValue === false) return false;
      
      if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false
      }

      $.ajax({
        type: "POST",
        url: "/api/queue",
        data: JSON.stringify({'Singer': inputValue,'Song': this.text}),
        crossDomain: true,
        contentType: "application/json",
        dataType: "json",
        success:function(result){
            swal("Nice!", "You're all set!");
            $(".actions").slideUp();
        },
        error:function(xhr,status,error){
            swal({
              type: "error",
              title: "Oh no..",
              text: status
            })
            console.log("error:" + status);
        }
      });      
      
    });    
  }

  function get_query(){
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('song'))
    {
      $song = urlParams.get('song');
      $('#search').val($song);
      get_match($song);
    }
  }

  function get_match(data){
    var found = jQuery.grep(lines, function(value, i) {            
      if(value.toLowerCase().indexOf(".mp3") != -1){
        return false;
      }
      return value.toLowerCase().indexOf(data.toLowerCase()) != -1 
    });

    $('#div1').text('');
    $('#results').text(found.length + " songs.");

    $.each(found, function(i, val){
      song = val.replace(".cdg", "")
      url = "https://www.google.com/#q=lyrics+" + encodeURIComponent(song);
      link = '<div><div class="link">' + song + '<ul class="actions"><li><a target="_new" href="' + url + '">Find Lyrics</a></li><li><span class="queuelink" data-song="' + song + '">Add To Queue</span></li></ul></div>';      
      $('#div1').append(link);
    });

    $(".link").bind('click', toggle);
    $(".queuelink").bind('click', queue_song);
  }
