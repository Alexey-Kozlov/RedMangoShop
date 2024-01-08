using RedMangoShop.Utility;

namespace RedMangoShop.Models.DTO;

public class OrderHeaderUpdateDTO
{
    public int OrderHeaderId {get; set;}
    public string PickupName {get; set;}
    public string PickupPhoneNumber {get; set;}
    public string PickupEmail {get; set;}
    public string StripePaymentIntentId {get; set;}
    public StatusEnumerator Status {get; set;}
}