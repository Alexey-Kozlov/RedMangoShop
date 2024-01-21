using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedMangoShop.Data;
using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using RedMangoShop.Utility;
using System.Net;

namespace RedMangoShop.Controllers;

[ApiController]
[Route("api/MenuItem")]
public class MenuItemController : ControllerBase
{
    private const string ORDER_PRICE_LOW = "Цена, понижение";
    private const string ORDER_PRICE_HIGH = "Цена, повышение";
    private const string ORDER_NAME_LOW = "Наименование, Я - А";
    private const string ORDER_NAME_HIGH = "Наименование, А - Я";
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    public MenuItemController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenuItems(string search, string category, string sortType)
    {
        var response = new ApiResponse<IEnumerable<MenuItem>>();
        var result = _db.MenuItems as IQueryable<MenuItem>;
        if(!string.IsNullOrEmpty(search))
        {
            result = result.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }
        if(!string.IsNullOrEmpty(category) && category != "Все")
        {
            result = result.Where(p => p.Category == category);
        }

        result = sortType switch
        {
            ORDER_NAME_HIGH => result.OrderBy(p => p.Name),
            ORDER_NAME_LOW => result.OrderByDescending(p => p.Name),
            ORDER_PRICE_HIGH => result.OrderBy(p => p.Price),
            ORDER_PRICE_LOW => result.OrderByDescending(p => p.Price),
            _ => result.OrderBy(p => p.Name),
        };
        response.Result = await result.ToListAsync();                 
        response.StatusCode = HttpStatusCode.OK;
        return Ok(response);
    }

    [HttpGet("{id:int}", Name ="GetMenuItem")]
    public async Task<IActionResult> GetMenuItem(int id)
    {
        if(id == 0)
        {
            return BadRequest(new ApiResponse<object>(){StatusCode = HttpStatusCode.BadRequest, IsSuccess=false});
        }
        var response = new ApiResponse<MenuItem>();
        response.Result = await _db.MenuItems.FirstOrDefaultAsync(p => p.Id == id);
        if(response.Result == null)
        {
            response.StatusCode = HttpStatusCode.NotFound;
            response.IsSuccess = false;
            return NotFound(response);
        }
        response.StatusCode = HttpStatusCode.OK;
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles =Constant.Role_Admin)]
    public async Task<ActionResult<ApiResponse<MenuItem>>> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
    {
        var response = new ApiResponse<MenuItem>();
        try
        {
            if(ModelState.IsValid)
            {
                if(menuItemCreateDTO.File == null || menuItemCreateDTO.File.Length == 0)
                {
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("Необходимо выбрать изображение!");
                    return BadRequest(response);
                }
                var menuItemCreate = _mapper.Map<MenuItem>(menuItemCreateDTO);
                _db.MenuItems.Add(menuItemCreate);
                await _db.SaveChangesAsync();
                response.Result = menuItemCreate;
                response.StatusCode = HttpStatusCode.Created;
                return CreatedAtRoute("GetMenuItem", new { id = menuItemCreate.Id }, response);
            }
            else
            {
                response.IsSuccess = false;
            }
        }
        catch(Exception ex)
        {
            response.IsSuccess = false;
            response.ErrorMessages = new List<string>(){ex.ToString()};
        }
        return Ok(response);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles =Constant.Role_Admin)]
    public async Task<ActionResult<ApiResponse<MenuItem>>> UpdateMenuItem(int id, [FromForm] MenuItemUpdateDTO menuItemUpdateDTO)
    {
        var response = new ApiResponse<MenuItem>();
        try
        {
            if(ModelState.IsValid)
            {
                if(menuItemUpdateDTO == null || id == 0 || id != menuItemUpdateDTO.Id)
                {
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("Ошибка обновляемой записи!");
                    return BadRequest(response);
                }

                var item = await _db.MenuItems.FindAsync(id);
                if (item == null)
                {
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("Запись не найдена!");
                    return NotFound(response);
                }

                _mapper.Map(menuItemUpdateDTO, item);             
                _db.MenuItems.Update(item);
                await _db.SaveChangesAsync();
                response.StatusCode = HttpStatusCode.NoContent;
                return Ok(response);
            }
            else
            {
                response.IsSuccess = false;
            }
        }
        catch(Exception ex)
        {
            response.IsSuccess = false;
            response.ErrorMessages = new List<string>(){ex.ToString()};
        }
        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles =Constant.Role_Admin)]
    public async Task<ActionResult<ApiResponse<MenuItem>>> DeleteMenuItem(int id)
    {
        var response = new ApiResponse<MenuItem>();
        try
        {

            if (id == 0)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.IsSuccess = false;
                response.ErrorMessages.Add("Id не должно быть равно 0!");
                return BadRequest(response);
            }

            var item = await _db.MenuItems.FindAsync(id);
            if (item == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                response.IsSuccess = false;
                response.ErrorMessages.Add("Запись не найдена!");
                return NotFound(response);
            }

            Thread.Sleep(2000);

            _db.MenuItems.Remove(item);
            await _db.SaveChangesAsync();
            response.StatusCode = HttpStatusCode.NoContent;
            return Ok(response);

        }
        catch (Exception ex)
        {
            response.IsSuccess = false;
            response.ErrorMessages = new List<string>() { ex.ToString() };
        }
        return Ok(response);
    }
}