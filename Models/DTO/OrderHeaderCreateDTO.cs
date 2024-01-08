using RedMangoShop.Utility;

namespace RedMangoShop.Models.DTO;

public class OrderHeaderCreateDTO
{
    public string PickupName {get; set;}
    public string PickupPhoneNumber {get; set;}
    public string PickupEmail {get; set;}
    public string ApplicationUserId {get; set;}
    public double OrderTotal {get; set;}
    public string StripePaymentIntentId {get; set;}
    public StatusEnumerator Status {get; set;}
    public int TotalItems {get; set;}
    public ICollection<OrderDetailsCreateDTO> OrderDetailsDTO {get; set;}
}