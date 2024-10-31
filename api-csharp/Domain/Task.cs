namespace Domain;

public class Task
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Label { get; set; }
    public ETaskStatus Status { get; set; }
}