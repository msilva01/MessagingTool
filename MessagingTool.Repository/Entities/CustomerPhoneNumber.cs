using System.ComponentModel.DataAnnotations.Schema;

namespace MessagingTool.Repository.Entities;

public class CustomerPhoneNumber
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int Language { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime DateCreated { get; set; }
    public bool DoNotCall { get; set; }
    public bool Active { get; set; }

    public virtual ICollection<CustomerMessageLog> CustomerMessageLogs { get; } = new List<CustomerMessageLog>();
}