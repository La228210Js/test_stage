using Domain;
using Microsoft.EntityFrameworkCore;
using Task = Domain.Task;

namespace Infrastructure.EntityFramework;

public class EfTaskRepository: ITaskRepository 
{
    private readonly CollaborativeTasksContext _context;

    public EfTaskRepository(CollaborativeTasksContext context)
    {
        _context = context;
    }

    public List<Task> GetAllPagination(int pageNumber, int pageSize)
    {
        return _context.Tasks
            .OrderBy(task => task.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public List<TaskWithUserDTO> GetAllWithUser()
    {
        return _context.Tasks.Select(task => new TaskWithUserDTO
        {
            Label = task.Label,
            UserFullName = _context.Users
                .Where(user => user.Id == task.UserId)
                .Select(user => user.FirstName + " " + user.Name)
                .FirstOrDefault() ?? "Pas d'attribution",
            Status = task.Status
        }).ToList();
    }

    public List<Task> GetByLabel(string label, int pageNumber, int pageSize)
    {
        return _context.Tasks
            .Where(t => t.Label.Contains(label))
            .OrderBy(t => t.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public List<Task> GetByUserStatus(int? userId, ETaskStatus status, int pageNumber, int pageSize)
    {
        return _context.Tasks
            .Where(t => t.UserId == userId && t.Status == status)
            .OrderBy(t => t.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public Task Create(Task task)
    {
        _context.Tasks.Add(task);
        _context.SaveChanges();
        return new Task()
        {
            UserId = task.UserId,
            Label = task.Label,
            Status = ETaskStatus.EnCours
        };
    }

    public bool Update(Task task)
    {
        var entity = _context.Tasks.FirstOrDefault(e => e.Id == task.Id);
        if (entity == null)
            return false;
        
        entity.UserId = task.UserId;
        entity.Label = task.Label;
        entity.Status = task.Status;
        _context.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var entity = _context.Tasks.FirstOrDefault(e => e.Id == id);

        if (entity == null)
            return false;
        
        _context.Tasks.Remove(entity);
        _context.SaveChanges();
        return true;
    }

    public int Count()
    {
        return _context.Tasks.Count();
    }
}