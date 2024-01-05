using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedMangoShop.Data;
using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using System.Net;

namespace RedMangoShop.Controllers;

[ApiController]
[Route("api/MenuItem")]
public class MenuItemController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    public MenuItemController(ApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenuItems()
    {
        var response = new ApiResponse<IEnumerable<MenuItem>>();
        response.Result = await _db.MenuItems.ToListAsync();
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