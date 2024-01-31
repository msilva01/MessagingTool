using System.ComponentModel.DataAnnotations.Schema;

namespace MessagingTool.Repository.Entities;

public class CustomerMessageLog
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public DateTime MessageSentOn { get; set; }
    public int CustomerPhoneNumberId { get; set; }
    public CustomerPhoneNumber CustomerPhoneNumber { get; set; }
}