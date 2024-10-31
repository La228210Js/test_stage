using API.DTOs;
using Domain;
using Infrastructure.EntityFramework;
using Microsoft.AspNetCore.Mvc;
using Task = Domain.Task;

namespace API.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;

    public TaskController(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<TaskPaginationResponse> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 7)
    {
        if (pageNumber < 1)
            pageNumber = 1;
        if (pageSize < 1)
            pageSize = 7;
        
        var tasks = _taskRepository.GetAllPagination(pageNumber, pageSize);
        var totalTasks = _taskRepository.Count();

        return Ok(new TaskPaginationResponse
        {
            Tasks = tasks,
            TotalTasks = totalTasks
        });
    }

    [HttpGet("label")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<TaskPaginationResponse> GetTasksByLabel([FromQuery] string label, int pageNumber = 1, int pageSize = 7)
    {
        if (pageNumber < 1)
            pageNumber = 1;
        if (pageSize < 1)
            pageSize = 7;
                
        var tasks = _taskRepository.GetByLabel(label, pageNumber, pageSize);
        var totalTasks = tasks.Count;
        
        return Ok(new TaskPaginationResponse
        {
            Tasks = tasks,
            TotalTasks = totalTasks
        });
    }

    [HttpGet("userAndStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<TaskPaginationResponse> GetTasksByUserAndStatus([FromQuery] int userId, [FromQuery] ETaskStatus status,
        int pageNumber = 1, int pageSize = 7)
    {
        if (pageNumber < 1)
            pageNumber = 1;
        if (pageSize < 1)
            pageSize = 7;
        
        var tasks = _taskRepository.GetByUserStatus(userId, status, pageNumber, pageSize);
        var totalTasks = tasks.Count;

        return Ok(new TaskPaginationResponse
        {
            Tasks = tasks,
            TotalTasks = totalTasks
        });
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public ActionResult<Task> Create([FromBody] CreateTaskResponse createTaskResponse)
    {
        var task = new Task
        {
            Label = createTaskResponse.Label,
            Status = createTaskResponse.Status,
            UserId = createTaskResponse.UserId
        };
        
        return new ObjectResult(_taskRepository.Create(task))
        {
            StatusCode = StatusCodes.Status201Created
        };
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult Update([FromBody] Task task)
    {
        return _taskRepository.Update(task) ? new NoContentResult() : new NotFoundResult(); 
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult Delete(int id)
    {
        return _taskRepository.Delete(id) ? new NoContentResult() : new NotFoundResult();
    }
    
}