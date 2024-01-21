using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedMangoShop.Models;

public class OrderDetails
{
    [Key]
    public int OrderDetailsId {get; set;}
    public int OrderHeaderId {get; set;}
    [ForeignKey("OrderHeaderId")]
    public OrderHeader OrderHeader {get; set;}
    public int MenuItemId {get; set;}
    [ForeignKey("MenuItemId")]
    public MenuItem MenuItem {get; set;}
    [Required]
    public int Quantity {get; set;}
    [Required]
    public string ItemName {get; set;}
    [Required]
    public double Price {get; set;}
}