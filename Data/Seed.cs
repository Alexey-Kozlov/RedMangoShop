using Microsoft.EntityFrameworkCore;
using RedMangoShop.Models;

namespace RedMangoShop.Data;
public class Seed
{
    public static void SeedData(ModelBuilder builder)
    {
        builder.Entity<MenuItem>().HasData(
                    new MenuItem
                    {
                        Id = 1,
                        Name = "Spring Roll",
                        Description = "Вкусный ролл",
                        Image = null,
                        Price = 7.99,
                        Category = "Appetizer",
                        SpecialTag = ""
                    },
                    new MenuItem
                    {
                        Id = 2,
                        Name = "Idli",
                        Description = "Чтото непонятное",
                        Image = null,
                        Price = 8.99,
                        Category = "Appetizer",
                        SpecialTag = ""
                    },
                    new MenuItem
                    {
                        Id = 3,
                        Name = "Panu Pury",
                        Description = "Странное блюдо",
                        Image = null,
                        Price = 8.50,
                        Category = "Appetizer",
                        SpecialTag = "Best Seller"
                    }
                );
    }
}