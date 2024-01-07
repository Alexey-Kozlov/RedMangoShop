using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedMangoShop.Data;
using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using System.Net;

namespace RedMangoShop.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShoppingCartController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    public ShoppingCartController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> AddOrUpdateItemInCart(string userId, int menuItemId, int itemQuantityChanged)
    {
        var response = new ApiResponse<object>();
        var shoppingCart = await _db.ShoppingCarts
            .Include(p => p.CartItems)
            .FirstOrDefaultAsync(p => p.UserId == userId);
        var menuItem = await _db.MenuItems.FindAsync(menuItemId);
        if(menuItem == null)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            return BadRequest(response);
        }
        if(shoppingCart == null && itemQuantityChanged > 0)
        {
            var newCart = new ShoppingCart(){ UserId = userId };
            _db.ShoppingCarts.Add(newCart);
            await _db.SaveChangesAsync();

            var newCartItem = new CartItem()
            {
                MenuItem = menuItem,
                Quantity = itemQuantityChanged,
                ShoppingCart = newCart
            };
            _db.CartItems.Add(newCartItem);
            await _db.SaveChangesAsync();
        }
        else
        {
            var cartItem = shoppingCart.CartItems.FirstOrDefault(p => p.MenuItemId == menuItemId);
            if (cartItem == null)
            {
                if (itemQuantityChanged > 0)
                {
                    var newCartItem = new CartItem()
                    {
                        MenuItem = menuItem,
                        Quantity = itemQuantityChanged,
                        ShoppingCart = shoppingCart
                    };
                    _db.CartItems.Add(newCartItem);
                }
            }
            else
            {
                cartItem.Quantity += itemQuantityChanged;
                if(cartItem.Quantity <= 0)        
                {
                    _db.CartItems.Remove(cartItem);
                }
                else
                {
                    _db.CartItems.Update(cartItem);
                }
            }
            
            await _db.SaveChangesAsync();
        }
        return response;
    }
}