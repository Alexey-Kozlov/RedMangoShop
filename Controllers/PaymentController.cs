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
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    public PaymentController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ShoppingCart>>> MakePayment(string userId)
    {
        var response = new ApiResponse<ShoppingCart>();
        if(string.IsNullOrEmpty(userId))
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            return BadRequest(response);
        }
        var shoppingCart = await _db.ShoppingCarts
            .Include(p => p.CartItems)
            .ThenInclude(p => p.MenuItem)
            .FirstOrDefaultAsync(p => p.UserId == userId);
        if(shoppingCart == null || shoppingCart.CartItems == null || !shoppingCart.CartItems.Any())
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            return BadRequest(response);
        }

        shoppingCart.CartTotal = shoppingCart.CartItems.Sum(p => p.Quantity * p.MenuItem.Price);

        shoppingCart.StripePaymentIntentId = Guid.NewGuid().ToString() + "#" + shoppingCart.CartTotal.ToString();
        shoppingCart.ClientSecret =  Guid.NewGuid().ToString();

        response.Result = shoppingCart;
        response.StatusCode = HttpStatusCode.OK;
        return Ok(response);
    }
}