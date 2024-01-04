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
}