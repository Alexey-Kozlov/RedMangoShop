using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RedMangoShop.Utility;

namespace RedMangoShop.Models;

public class OrderHeader
{
    [Key]
    public int OrderHeaderId {get; set;}
    public string PickupName {get; set;}
    public string PickupPhoneNumber {get; set;}
    public string PickupEmail {get; set;}
    public string ApplicationUserId {get; set;}
    [ForeignKey("ApplicationUserId")]
    public ApplicationUser User {get; set;}
    public double OrderTotal {get; set;}
    public DateTime OrderDate {get; set;}
    public string StripePaymentIntentId {get; set;}
    public StatusEnumerator Status {get; set;}
    public int TotalItems {get; set;}
    public ICollection<OrderDetails> OrderDetails {get; set;}
}