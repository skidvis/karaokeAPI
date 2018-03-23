  var lines;
  var queue;
  var urlParams = new URLSearchParams(window.location.search);


  $(document).ready( function() {
    var random = Math.floor((Math.random() * 100) + 1);
    var songlist = '/Scripts/songs.js?' + random;
    $.get(songlist, function(data) {
       lines = data.split("\n");
       get_query();
    }, 'text');

    $('#search').keypress(function(e) {
      if(e.which == 13) {
        get_match($('#search').val());
      };      
    });    

    setTimeout(get_queue, 2000);

    $("#search-btn").bind("click", function(){
      get_match($('#search').val());
    });

    $("#add-btn").bind("click", function(){
      manage_song($('#add').val());
    });    
  });

  function get_queue(){
    $.ajax({
      url: "/api/queue",
      success:function(result){
          $("#queue").html('');
          
          if(result.length > 0){
            console.log(result);            

            var admin = '';
            var link = '';

            result.forEach(function(item){
              if(urlParams.has('admin')){
                admin = ' - <span class="delete" data-id="' + item.id + '"><i class="fas fa-trash-alt"></i></span>'
                admin += ' - <span class="kick" data-id="' + item.id + '"><i class="fas fa-arrow-down"></i></span>'
              }              

              link = "<li id='li-song-" + item.id + "' class='queue_song'><span class='song'><i class='fas fa-music ghost'></i> " + item.song + "</span><br /><span class='singer'><i class='fas fa-user'></i> " + item.singer + "</span>" + admin + "</li>";
              $("#queue").append(link);
            });

            $(".delete").bind('click', deleter);
            $(".kick").bind('click', kicker);
          }else{
            link = "<li class='queue_song'><span class='song'>Would you believe nobody is in the queue??</span><br /><span class='singer'>Lead the charge!! Search for a song now!</span></li>";
            $("#queue").append(link);            
          }      
        },
        error:function(xhr,status,error){
          console.log("error:" + status);
        }
    });    

    setTimeout(get_queue, 2000);
  }

  function deleter(){
    var id_to_delete = $(this).data("id");
    $.ajax({
      url: '/api/queue/' + id_to_delete,
      type: 'DELETE',
      success: function(result) {
          $("#li-song-" + id_to_delete).css("color", "red");
          console.log(result);
      }
    });
  }

  function kicker(){
    var id_to_delete = $(this).data("id");
    $.ajax({
      url: '/api/kick/' + id_to_delete,
      type: 'POST',
      success: function(result) {
          $("#li-song-" + id_to_delete).css("color", "green");
      }
    });
  }  

  function toggle(){
    $(".actions").slideUp();
    $("#result-" + $(this).data("song-id")).slideDown();
  }

  function queue_song(){
    event.preventDefault();
    event.stopPropagation();

    var lastUser = localStorage.getItem("lastUser");

    swal({
      title: "Who the heck are you?",
      text: $(this).data("song"),
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "Write your name!",
      inputValue: lastUser,
      html: true, 
      data: $(this).data("song")
    },
    function(inputValue){
      if (inputValue === false) return false;
      
      if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false
      } 
      
      if(lastUser == null){
        localStorage.setItem("lastUser", inputValue);
      }

      gtag('event', this.text, {
        'event_category': 'Queue Song',
        'event_label': inputValue
      });

      $.ajax({
        type: "POST",
        url: "/api/queue",
        data: JSON.stringify({'Singer': inputValue,'Song': this.text}),
        crossDomain: true,
        contentType: "application/json",
        dataType: "json",
        success:function(result){
            swal("Nice!", "You're all set!");
            $("#resultset").text('');
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
      var $song = urlParams.get('song');
      $('#search').val($song);
      get_match($song);
    }
  }

  function get_match(data){
    var found = {};    

    gtag('event', data, {
      'event_category': 'Search',
      'event_label': data
    });
    
    $.ajax({
      url: '/api/search',
      type: 'POST',
      data: JSON.stringify(data),
      crossDomain: true,
      contentType: "application/json",
      dataType: "json",      
      success: show_results
    });    
  }

  function manage_song(data){    
    $.ajax({
      url: '/api/add',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "text",      
      success: show_feedback
    });    
  }

  function show_feedback(result){
    $("#db-result").text(result);
    $('#add').val('');
  }

  function show_results(found){
    var $results = $('#results');
    $results.text("Your search resulted in " + found.length + " songs.");

    var url = '';
    var link = '';
    var song = '';

    $('#resultset').text('');
    $.each(found, function(i, val){
      song = val.title.replace(".cdg", "")
      url = "https://www.google.com/#q=lyrics+" + encodeURIComponent(song);
      link = '<li>';
      link += '<div class="song-title link" data-song-id="' + val.id + '"><i class="fas fa-plus-circle expando"></i> ' + song + '<span class="song-id">' + val.id + '</span></div>';
      link += '<div class="row justify-content-center actions" id="result-' + val.id + '"><div class="col-3"><a class="btn btn-link btn-sm" target="_new" href="' + url + '"><i class="fas fa-search"></i> Find Lyrics</a></div>';
      link += '<div class="col-3"><span class="queuelink btn btn-link btn-sm" data-song="' + song + '"><i class="fas fa-plus"></i> Add To Queue</span></div></div>';
      link += '</li>';   
      $('#resultset').append(link);
    });
    $(".actions").hide();
    $(".link").bind('click', toggle);
    $(".queuelink").bind('click', queue_song);    
  }
