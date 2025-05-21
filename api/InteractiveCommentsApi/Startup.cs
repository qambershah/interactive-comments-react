using System.Text.Encodings.Web;
using AngleSharp.Html.Dom;
using DefaultNamespace;
using InteractiveCommentsApi.Services;

// using HtmlSanitizer;

namespace InteractiveCommentsApi;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    /// <summary>
    /// This method gets called by the runtime. Use this method to add services to the container.
    /// </summary>
    public void ConfigureServices(IServiceCollection services)
    {
        // Add controllers and API documentation
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Configure CORS to allow frontend access
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.WithOrigins("https://qambershah.github.io", "http://localhost:5173")
                       .AllowAnyHeader()
                       .AllowAnyMethod();
            });
        });

        // Register in-memory comment service
        services.AddSingleton<ICommentService, CommentService>();
        // services.AddSingleton<HtmlSanitizer>();
        services.AddSingleton(HtmlEncoder.Default);
    }

    /// <summary>
    /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    /// </summary>
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Enable Swagger for local/dev environments
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Redirect HTTP to HTTPS in non-development environments
        app.UseHttpsRedirection();

        // Middleware order matters
        app.UseCors();
        app.UseRouting();

        // Endpoint routing for controller actions
        app.UseEndpoints(endpoints => endpoints.MapControllers());
    }
}