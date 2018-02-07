using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using karaokeAPI.Models;
using Microsoft.EntityFrameworkCore;
using MySql.Data.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.DataProtection;
using System.IO;


namespace KaraokeAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration){
            Configuration = configuration;
            BuildAppSettingsProvider();
        }

        private void BuildAppSettingsProvider()
        {
            AppSettingsProvider.ConnectionString = Configuration.GetSection("ConnectionStrings")["DefaultConnection"];
            AppSettingsProvider.AdminKey = Configuration.GetSection("Keys")["AdminKey"];
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {            
            services.AddMvc().AddSessionStateTempDataProvider();
            services.AddSession();
            services.AddDataProtection()
            .SetApplicationName("karaokieAPI")
            .PersistKeysToFileSystem(new DirectoryInfo(@"/code/app/keys"));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseStaticFiles();
            app.UseSession();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
