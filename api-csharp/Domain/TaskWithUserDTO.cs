namespace Domain;

public class TaskWithUserDTO
{
    public string Label { get; set; }
    public ETaskStatus Status { get; set; }
    public string UserFullName { get; set; }
    
}