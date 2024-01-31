using MessagingTool.Repository.Entities;
using Microsoft.EntityFrameworkCore;

namespace MessagingTool.Repository.Context;

public class MessagingToolDbContext :DbContext
{
    
    public MessagingToolDbContext(DbContextOptions<MessagingToolDbContext> opt):base(opt){}
    public virtual DbSet<CustomerPhoneNumber> PhoneNumbers { get; set; }
    public virtual DbSet<CustomerMessageLog> MessageLogs { get; set; }
}