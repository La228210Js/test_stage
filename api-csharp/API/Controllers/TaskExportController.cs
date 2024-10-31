using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskExportController: ControllerBase
{
    private readonly TaskExportToExcelService _exportToExcelService;

    public TaskExportController(TaskExportToExcelService exportToExcelService)
    {
        _exportToExcelService = exportToExcelService;
    }

    [HttpGet("export")]
    public ActionResult ExportTasksToExcel()
    {
        var excelFile = _exportToExcelService.ExportTasksToExcel();
        var fileName = "Taches.xlsx";
        
        return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}