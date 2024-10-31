namespace API.DTOs;
using Task = Domain.Task;

public class TaskPaginationResponse
{
    public List<Task> Tasks { get; set; }
    public int TotalTasks { get; set; }
}