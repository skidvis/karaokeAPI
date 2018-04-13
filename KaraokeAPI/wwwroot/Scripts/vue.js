//var app = {};

$(document).ready( function() {
  var app = new Vue({
    el: '#panes',
    data: {
      searchTerm: '',
      songs: {},
      queue: {},
      url: "https://www.google.com/#q=lyrics+",
      visible: '',
      isAdmin: false,
      inBox: '',
      feedBack: '',
      searchResults: '',
      tabShown: 'queue',
      favorites: []
    }, 
    created: function(){
      this.get_queue();
      var urlParams = new URLSearchParams(window.location.search);
      if(urlParams.has('admin')){
        this.isAdmin = true;
      }       
      if(localStorage.getItem("favorites")){
        this.favorites = JSON.parse(localStorage.getItem("favorites"));
      }
    },
    methods:{
      show_tab: function(tab_name){
        this.tabShown = tab_name;
        if(tab_name == 'queue'){
          $('#queue_link').addClass('active');
          $('#favorites_link').removeClass('active');
        }else{
          $('#queue_link').removeClass('active');
          $('#favorites_link').addClass('active');
        }
      },
      add_favorite: function(song_title){
        var found_match = jQuery.grep(this.favorites, function(song) {
          return song.title === song_title;
        })
        if(found_match.length == 0){
          this.favorites.push({title: song_title});
          localStorage.setItem("favorites", JSON.stringify(this.favorites));
          gtag('event', song_title, {
            'event_category': 'Favorite',
            'event_label': song_title
          });          
        }
      },
      remove_favorite: function(song_title){
        var found_match = jQuery.grep(this.favorites, function(song) {
          return song.title !== song_title;
        })
        if(found_match.length){
          this.favorites = found_match;
          localStorage.setItem("favorites", JSON.stringify(this.favorites));
        }
      },
      get_match: function(){
        var data = this.searchTerm;
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
          success: this.show_results
        });    
      },
      show_results: function(found){
        console.log("returned");
        this.songs = found;      
        this.searchResults = "Your search resulted in " + this.songs.length + " songs."       
      },
      show_queue: function(results){
        this.queue = results; 
      },
      show_song: function(song_id){
        this.visible = song_id;
      },
      queue_song: function(song){
        event.preventDefault();
        event.stopPropagation();
    
        var lastUser = localStorage.getItem("lastUser");
    
        swal({
          title: "Who the heck are you?",
          text: song,
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
          animation: "slide-from-top",
          inputPlaceholder: "Write your name!",
          inputValue: lastUser,
          html: true, 
          data: song
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
    
          gtag('event', song, {
            'event_category': 'Queue Song',
            'event_label': inputValue
          });
    
          $.ajax({
            type: "POST",
            url: "/api/queue",
            data: JSON.stringify({'Singer': inputValue,'Song': song}),
            crossDomain: true,
            contentType: "application/json",
            dataType: "json",
            success:function(result){
                swal("Nice!", "You're all set!");
                app.searchTerm = '';
                app.songs = '';
                app.show_tab('queue');
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
      },
      get_queue: function(){
        $.ajax({
          url: "/api/queue",
          success: this.show_queue
        });    
    
        setTimeout(this.get_queue, 2000);
      }, 
      deleter: function(song_id){
        var id_to_delete = song_id;
        $.ajax({
          url: '/api/queue/' + id_to_delete,
          type: 'DELETE',
          success: function(result) {
              $("#li-song-" + id_to_delete).css("color", "red");
          }
        })
      }, 
      kicker: function(song_id){
        var id_to_delete = song_id;
        $.ajax({
          url: '/api/kick/' + id_to_delete,
          type: 'POST',
          success: function(result) {
              $("#li-song-" + id_to_delete).css("color", "green");
          }
        })
      }, 
      manage_song: function(){    
        $.ajax({
          url: '/api/add',
          type: 'POST',
          data: JSON.stringify(this.inBox),
          contentType: "application/json",
          dataType: "text",      
          success: this.show_feedback
        });    
      },
      show_feedback: function(result){
        this.feedBack = result;
        this.inBox = '';
      }
    }
  })  
})

