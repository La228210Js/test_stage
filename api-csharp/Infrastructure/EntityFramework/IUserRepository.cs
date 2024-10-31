using Domain;

namespace Infrastructure.EntityFramework;

public interface IUserRepository
{
    List<User> GetAll();
    User? GetById(int id);
}