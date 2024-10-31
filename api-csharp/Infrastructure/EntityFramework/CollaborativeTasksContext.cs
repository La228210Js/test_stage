using Domain;
using Microsoft.EntityFrameworkCore;
using Task = Domain.Task;

namespace Infrastructure.EntityFramework;

public class CollaborativeTasksContext: DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Task> Tasks { get; set; }

    public CollaborativeTasksContext(DbContextOptions options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(builder =>
        {
            builder.ToTable("Users");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("Id");
            builder.Property(x => x.Name).HasColumnName("Name");
            builder.Property(x => x.FirstName).HasColumnName("FirstName");
        });

        modelBuilder.Entity<Task>(builder =>
        {
            builder.ToTable("Tasks");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("Id");
            builder.Property(x => x.Label).HasColumnName("Label");
            builder.Property(x => x.Status).HasConversion<byte>().HasColumnName("Status");
            builder.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
        });
    }
    
}