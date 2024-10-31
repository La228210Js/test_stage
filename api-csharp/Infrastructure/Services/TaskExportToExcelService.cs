using Infrastructure.EntityFramework;

namespace Infrastructure.Services;
using OfficeOpenXml;

public class TaskExportToExcelService
{
    private readonly ITaskRepository _taskRepository;

    public TaskExportToExcelService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public byte[] ExportTasksToExcel()
    {
        var tasks = _taskRepository.GetAllWithUser();
        using (var package = new ExcelPackage())
        {
            var worksheet = package.Workbook.Worksheets.Add("Tâches");

            worksheet.Cells[1, 1].Value = "Libellé";
            worksheet.Cells[1, 2].Value = "Attribution";
            worksheet.Cells[1, 3].Value = "Statut";

            for (int i = 0; i < tasks.Count ; i++)
            {
                worksheet.Cells[i + 2, 1].Value = tasks[i].Label;
                worksheet.Cells[i + 2, 2].Value = tasks[i].UserFullName;
                worksheet.Cells[i + 2, 3].Value = tasks[i].Status.ToString();
            }
            
            return package.GetAsByteArray();
        }
    }
}