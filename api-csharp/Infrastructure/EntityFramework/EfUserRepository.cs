using Domain;

namespace Infrastructure.EntityFramework;

public class EfUserRepository: IUserRepository
{
    private readonly CollaborativeTasksContext _context;

    public EfUserRepository(CollaborativeTasksContext context)
    {
        _context = context;
    }

    public List<User> GetAll()
    {
        return _context.Users.ToList();
    }

    public User? GetById(int id)
    {
        return _context.Users.FirstOrDefault(user => user.Id == id);
    }
}