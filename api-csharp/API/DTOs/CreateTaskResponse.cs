using Domain;

namespace API.DTOs;

public class CreateTaskResponse
{
    public int? UserId { get; set; }
    public string Label { get; set; }
    public ETaskStatus Status { get; set; }
}