using NPOI.XSSF.UserModel;

namespace MessagingTool.UI.Utils;

public static class ExcelHelper
{
    public static void Import(MemoryStream ms) 
    {
        XSSFWorkbook workbook;
        //using var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            
        workbook = new XSSFWorkbook(ms);
        
        var sheet = workbook.GetSheetAt(1);

        var currentRow = sheet.LastRowNum-5;
        while (currentRow <= sheet.LastRowNum)
        {
            var row = sheet.GetRow(currentRow);
            var currentCell = 0;
            while (currentCell <= row.LastCellNum)
            {
                var cell = row.GetCell(currentCell);
                if (cell != null)
                {
                    var value = cell.StringCellValue;
                }

                currentCell++;
            }

            currentRow++;
        }
    }
}