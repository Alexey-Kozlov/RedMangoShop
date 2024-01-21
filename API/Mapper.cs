using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using AutoMapper;
using RedMangoShop.Utility;
using Microsoft.AspNetCore.SignalR;

namespace RedMangoShop;

public static class MappingProfile
{
    public static MapperConfiguration InitAutoMapper()
    {
        MapperConfiguration config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile(new MapperProfileMenu());
        });
        return config;
    }
}

public class MapperProfileMenu: Profile
{
    public MapperProfileMenu()
    {
        CreateMap<MenuItemCreateDTO, MenuItem>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.SpecialTag, opt => opt.MapFrom(src => src.SpecialTag))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.File != null && src.File.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            src.File.CopyTo(ms);
                            dest.Image = ms.ToArray();
                        }
                    }
                    return dest.Image;
                })
            );

        CreateMap<MenuItemUpdateDTO, MenuItem>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.SpecialTag, opt => opt.MapFrom(src => src.SpecialTag))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Image, opt => opt.MapFrom((src, dest) =>
                {
                    if (src.File != null && src.File.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            src.File.CopyTo(ms);
                            dest.Image = ms.ToArray();
                        }
                    }
                    return dest.Image;
                })
            );

        CreateMap<RegisterRequestDTO, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Login))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

        CreateMap<OrderHeaderCreateDTO, OrderHeader>()
            .ForMember(dest => dest.ApplicationUserId, opt => opt.MapFrom(src => src.ApplicationUserId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.OrderTotal, opt => opt.MapFrom(src => src.OrderTotal))
            .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.StripePaymentIntentId, opt => opt.MapFrom(src => src.StripePaymentIntentId))
            .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.TotalItems))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

        CreateMap<OrderDetailsCreateDTO, OrderDetails>()
            .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => src.ItemName))
            .ForMember(dest => dest.MenuItemId, opt => opt.MapFrom(src => src.MenuItemId))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity));

        CreateMap<OrderHeaderUpdateDTO, OrderHeader>()
            .ForMember(dest => dest.Name, opt => 
            {
                opt.PreCondition(src => !string.IsNullOrEmpty(src.Name));
                opt.MapFrom(src => src.Name);
            })
            .ForMember(dest => dest.Phone, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Phone)))
            .ForMember(dest => dest.StripePaymentIntentId, opt => opt.Condition(src => !string.IsNullOrEmpty(src.StripePaymentIntentId)))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
    }
}