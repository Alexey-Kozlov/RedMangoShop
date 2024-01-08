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
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    public OrderController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<OrderHeader>>>> GetOrders(string userId)
    {
        var response = new ApiResponse<List<OrderHeader>>();
        var orderHeaders = _db.OrderHeaders
            .Include(p => p.OrderDetails)
            .ThenInclude(p => p.MenuItem)
            .OrderByDescending(p => p.OrderHeaderId);
        if(!string.IsNullOrEmpty(userId))
        {
            response.Result = await orderHeaders.Where(p => p.ApplicationUserId == userId).ToListAsync();
        }
        else
        {
            response.Result = await orderHeaders.ToListAsync();
        }
        response.StatusCode = HttpStatusCode.OK;
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<OrderHeader>>> GetOrder(int id)
    {
        var response = new ApiResponse<OrderHeader>();
        if(id <= 0)
        {
            response.IsSuccess = false;
            response.StatusCode = HttpStatusCode.BadRequest;
            return BadRequest(response);
        }

        var orderHeader = await _db.OrderHeaders
            .Include(p => p.OrderDetails)
            .ThenInclude(p => p.MenuItem)
            .FirstOrDefaultAsync(p => p.OrderHeaderId == id);
        if(orderHeader == null)
        {
            response.StatusCode = HttpStatusCode.NotFound;
            response.IsSuccess = false;
            return NotFound(response);
        }
        response.Result = orderHeader;        
        response.StatusCode = HttpStatusCode.OK;
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderHeader>>> CreateOrder([FromBody] OrderHeaderCreateDTO orderHeaderCreateDTO)
    {
        var response = new ApiResponse<OrderHeader>();
        try
        {
            var order = _mapper.Map<OrderHeader>(orderHeaderCreateDTO);
            if(ModelState.IsValid)
            {
                _db.OrderHeaders.Add(order);
                await _db.SaveChangesAsync();
                foreach(var orderDetailDTO in orderHeaderCreateDTO.OrderDetailsDTO)
                {
                    var orderDetail = _mapper.Map<OrderDetails>(orderDetailDTO);
                    orderDetail.OrderHeaderId = order.OrderHeaderId;
                    _db.OrderDetails.Add(orderDetail);
                }
                await _db.SaveChangesAsync();
                response.StatusCode = HttpStatusCode.OK;
                response.Result = order;
                return Ok(response);
            }
        }
        catch (Exception ex)
        {
            response.IsSuccess = false;
            response.ErrorMessages.Add(ex.Message);            
        }
        return response;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateOrderHeader(int id, [FromBody] OrderHeaderUpdateDTO orderHeaderUpdateDTO)
    {
        var response = new ApiResponse<object>();
        if(orderHeaderUpdateDTO == null || id != orderHeaderUpdateDTO.OrderHeaderId)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            return BadRequest(response);
        }
        var order = await _db.OrderHeaders.FirstOrDefaultAsync(p => p.OrderHeaderId == id);
        if(order == null)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            return BadRequest(response);
        }
        _mapper.Map(orderHeaderUpdateDTO, order);
        await _db.SaveChangesAsync();
        response.StatusCode = HttpStatusCode.NoContent;
        return Ok(response);
    }
}