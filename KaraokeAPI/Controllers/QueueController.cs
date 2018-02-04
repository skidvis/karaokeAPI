using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using karaokeAPI.Models;
using Newtonsoft.Json;


namespace karaokeAPI.Controllers
{
    //[Route("api/[controller]")]
    public class QueueController : Controller
    {

        private readonly SongContext _context;
        public QueueController(SongContext context)
        {
            _context = context;
        }

        // GET api/values
        [HttpGet][Route("api/queue")]
        public IEnumerable<SongRequest> Get()
        {
            IEnumerable<SongRequest> songs = _context.SongRequests.Where(b => b.Viewed == false);            
            IEnumerable<SongRequest> results = songs.ToList();

            return results;
        }

        // POST api/values
        [HttpPost][Route("api/queue")]
        public IActionResult Post([FromBody]SongRequest value)
        {
            _context.SongRequests.Add(value);
            _context.SaveChanges();
            return StatusCode(201, value);
        }

        [HttpDelete("{id}")][Route("api/queue/{id}")]
        public IActionResult Delete(long id)
        {
            SongRequest song = _context.SongRequests.FirstOrDefault(b => b.Id == id);
            _context.SongRequests.Remove(song);
            _context.SaveChanges();
            return StatusCode(201, id);
        }        

        [HttpPost][Route("api/search")]
        public IEnumerable<Song> find_songs([FromBody]string value)
        {
            IEnumerable<Song> songs = _context.Songs.Where(b => b.Title.Contains(value)).Take(100);            
            IEnumerable<Song> results = songs.OrderBy(s => s.Title).ToList();

            return results;
        }        
    }
}
