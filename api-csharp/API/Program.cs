using Infrastructure.EntityFramework;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CollaborativeTasksContext>(o => o.UseMySql(
        builder.Configuration.GetConnectionString("CollaborativeTasks"),
        new MySqlServerVersion(new Version(5, 7, 0))
        ));


builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IUserRepository, EfUserRepository>();
builder.Services.AddScoped<ITaskRepository, EfTaskRepository>();
builder.Services.AddScoped<CollaborativeTasksContext>();
builder.Services.AddScoped<TaskExportToExcelService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Development");
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();