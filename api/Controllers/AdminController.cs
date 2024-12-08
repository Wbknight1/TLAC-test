using api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;


namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        // GET: api/<AdminController>
        [HttpGet]
        public async Task<List<Admin>> Get()
        {
            AdminDatabase myDatabase = new();
            return await myDatabase.GetAllAdmins();
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}", Name = "GetAnAdmin")]
        public async Task<List<Admin>> Get(int id)
        {
            AdminDatabase myDatabase = new();
            return await myDatabase.GetAnAdmin(id);
        }

        // POST api/<AdminController>
        [HttpPost]
        public async Task Post([FromBody] Admin value)
        {

            AdminDatabase myDatabase = new();
             await myDatabase.SendAnAdmin(value);

        }

        // PUT api/<AdminController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Admin value)
        {
            AdminDatabase myDatabase = new();
             await myDatabase.EditAnAdmin(value, id);

        }

        // DELETE api/<AdminController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            AdminDatabase myDatabase = new();
             await myDatabase.DeleteAnAdmin(id);

        }
    }
}
