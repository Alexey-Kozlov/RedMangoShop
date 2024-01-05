using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RedMangoShop.Models;

namespace RedMangoShop.Data;

public class ApplicationDbContext: IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions options): base(options)
    {
    }

    public DbSet<ApplicationUser> ApplicationUser {get; set;}
    public DbSet<MenuItem> MenuItems {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        Seed.SeedData(builder);
    }
}