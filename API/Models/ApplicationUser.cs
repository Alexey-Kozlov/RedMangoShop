using Microsoft.AspNetCore.Identity;

namespace RedMangoShop.Models;

public class ApplicationUser : IdentityUser
{
    public string Name {get; set;}
}