using RedMangoShop.Utility;

namespace RedMangoShop.Models.DTO;

public class OrderHeaderUpdateDTO
{
    public int OrderHeaderId {get; set;}
    public string Name {get; set;}
    public string Phone {get; set;}
    public string StripePaymentIntentId {get; set;}
    public StatusEnumerator Status {get; set;}
}