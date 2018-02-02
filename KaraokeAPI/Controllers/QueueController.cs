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
    [Route("api/[controller]")]
    public class QueueController : Controller
    {

        private readonly SongContext _context;
        public QueueController(SongContext context)
        {
            _context = context;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<SongRequest> Get()
        {
            IEnumerable<SongRequest> songs = _context.SongRequests.Where(b => b.Viewed == false);            
            IEnumerable<SongRequest> results = songs.ToList();

            return results;
        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody]SongRequest value)
        {
            _context.SongRequests.Add(value);
            _context.SaveChanges();
            return StatusCode(201, value);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            SongRequest song = _context.SongRequests.FirstOrDefault(b => b.Id == id);
            _context.SongRequests.Remove(song);
            _context.SaveChanges();
            return StatusCode(201, id);
        }        
    }
}