using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using AutoMapper;

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

    }
}