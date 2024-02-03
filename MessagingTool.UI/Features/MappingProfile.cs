using System.Text.RegularExpressions;
using AutoMapper;

namespace MessagingTool.UI.Features;

public class MappingProfile:Profile
{
    public MappingProfile()
    {
        CreateMap<PhoneNumberSelected, PhoneNumbersDto>()
            .ForMember(dto => dto.PhoneNumber, opt => opt.ConvertUsing<PhoneNumberFormatter,string>(o => o.PhoneNumber))
            .ForMember(dto => dto.MessageSentOn, opt=> opt.ConvertUsing<StandardDateFormatter,DateTime?>(o => o.MessageSentOn))
            ;
    }
    
}

public class PhoneNumberFormatter : IValueConverter<string, string>
{
    public string Convert(string sourceMember, ResolutionContext context)
    {
        var matches = Regex.Matches(sourceMember, "(\\d{3})(\\d{3})(\\d{4})", RegexOptions.None);
        if (matches.Count > 0 && matches[0].Groups.Count > 3)
        {
            var groupMatch = matches[0].Groups;
            return $"({groupMatch[1].Value}) {groupMatch[2].Value}-{groupMatch[3].Value}";
        }

        return sourceMember;
    }
}

public class StandardDateFormatter : IValueConverter<DateTime?, string>
{

    public string Convert(DateTime? sourceMember, ResolutionContext context)
    {
        return sourceMember == null || sourceMember == DateTime.MinValue ? "" : sourceMember.Value.ToString("g");
    }
}