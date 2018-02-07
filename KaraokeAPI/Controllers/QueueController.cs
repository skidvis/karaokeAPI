using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using karaokeAPI.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace karaokeAPI.Controllers
{    
    //[Route("api/[controller]")]
    public class QueueController : Controller
    {  
        // GET api/values
        [HttpGet][Route("api/queue")]
        public IEnumerable<SongRequest> Get()
        {
            IEnumerable<SongRequest> results;

            using(var db = new SongContext()){
                IEnumerable<SongRequest> songs = db.SongRequests.Where(b => b.Viewed == false);            
                 results = songs.ToList();                
            }
            return results;
        }

        // POST api/values
        [HttpPost][Route("api/queue")]
        public IActionResult Post([FromBody]SongRequest value)
        {
            using(var db = new SongContext()){
                db.SongRequests.Add(value);
                db.SaveChanges();
            }
            return StatusCode(201, value);
        }

        [HttpDelete("{id}")][Route("api/queue/{id}")]
        public IActionResult Delete(long id)
        {
            using(var db = new SongContext()){
                SongRequest song = db.SongRequests.FirstOrDefault(b => b.Id == id);
                db.SongRequests.Remove(song);
                db.SaveChanges();                
            }
            return StatusCode(201, id);
        }        

        [HttpPost][Route("api/search")]
        public IEnumerable<Song> find_songs([FromBody]string value)
        {
            IEnumerable<Song> results;

            if(value == AppSettingsProvider.AdminKey){
                HttpContext.Session.SetString("Admin", "True");

                List<Song> dummy = new List<Song>();
                Song sng = new Song();
                sng.Id = 777;
                sng.Title = "God Mode Unlocked";
                dummy.Add(sng);
                return dummy;
            }

            using(var db = new SongContext()){
                IEnumerable<Song> songs = db.Songs.Where(b => b.Title.Contains(value)).Take(100);            
                results = songs.OrderBy(s => s.Title).ToList();
            }

            return results;
        }   

        [HttpPost][Route("api/add")]
        public string manage_song([FromBody]string value)
        {
            bool IsRemove = value.Substring(0,2) == "--";
            var title = IsRemove ? value.Substring(2, value.Length-2) : value;

            if(HttpContext.Session.GetString("Admin") == "True" && title.Trim() != String.Empty){
                if(IsRemove){                    
                    using(var db = new SongContext()){                        
                        Song song = db.Songs.FirstOrDefault(b => b.Id == int.Parse(title));
                        if(song != null){
                            db.Songs.Remove(song);
                            db.SaveChanges();                
                            return $"Removed: {song.Title}";
                        }
                    }                    
                    return $"Not Found";
                }else{
                    using(var db = new SongContext()){
                        Song newsong = new Song();
                        newsong.Title = title;
                        db.Songs.Add(newsong);
                        db.SaveChanges();                
                    }                    
                    return $"Added: {title}";
                }
            }
            return "No Change.";
        }              
    }
}
