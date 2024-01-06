using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RedMangoShop;
using RedMangoShop.Data;
using RedMangoShop.Models;

var builder = WebApplication.CreateBuilder(args);
//конфигурация EF Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultDbConnection"));
});
builder.Services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>();
//конфигурация пароля
builder.Services.Configure<IdentityOptions>(opt =>
{
    opt.Password.RequireDigit = false;
    opt.Password.RequiredLength = 1;
    opt.Password.RequireLowercase = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequireNonAlphanumeric = false;   
});

//конфигурация конвейера для работы с JWT-аутентификацией
builder.Services.AddAuthentication(p => 
{
   p.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
   p.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; 
}).AddJwtBearer(p =>
{
   p.RequireHttpsMetadata = false;
   p.SaveToken = true; 
   p.TokenValidationParameters = new TokenValidationParameters
   {
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetValue<string>("ApiSettings:Secret"))),
    ValidateIssuer = false,
    ValidateAudience = false
   };
});

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    //здесь конфиг для сваггера - чтобы можно было проверять JWT-аутентификацию
    opt.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme,
    new OpenApiSecurityScheme
    {
        Description = "JWT Authorization" +
        "Введите 'Bearer' [space] and token, например -> \"Bearer 12345kjhgkhgkj\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });
    opt.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

//автомаппер
var mapper = MappingProfile.InitAutoMapper().CreateMapper();
builder.Services.AddSingleton(mapper);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();