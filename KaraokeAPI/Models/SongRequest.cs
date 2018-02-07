using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace karaokeAPI.Models
{
  public class SongRequest
  {
        [Key][DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Singer { set; get; }
        public string Song { set; get; }
        public bool Viewed { set; get; }
  }

  public class Song{
        [Key][DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { set; get; }      
  }

  public class SongContext : DbContext  
    {
      public DbSet<SongRequest> SongRequests { get; set; }
      public DbSet<Song> Songs { get; set; }

      protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
      => optionsBuilder.UseMySQL(AppSettingsProvider.ConnectionString);
    }
}

