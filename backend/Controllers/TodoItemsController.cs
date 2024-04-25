using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore;

[ApiController]
[Route("[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TodoItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/TodoItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
    {
        return await _context.TodoItems.ToListAsync();
    }

    // Other actions (POST, PUT, DELETE) go here
}
