using Domain;

namespace Infrastructure.EntityFramework;
using Task = Domain.Task;

public interface ITaskRepository
{
    List<Task> GetAllPagination(int pageNumber, int pageSize);
    List<TaskWithUserDTO> GetAllWithUser();
    List<Task> GetByLabel(string label, int pageNumber, int pageSize);
    List<Task> GetByUserStatus(int? userId, ETaskStatus status, int pageNumber, int pageSize);
    Task Create(Task task);
    bool Update(Task task);
    bool Delete(int id);
    int Count();
}