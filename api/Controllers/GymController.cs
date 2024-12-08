using api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GymController : ControllerBase
    {
        // GET: api/<GymController>
        [HttpGet("api/Gym", Name = "GetGyms")]
        public async Task<List<Gym>> Get()
        {
            GymDatabase myDatabase = new();
            return await myDatabase.GetAllGyms();
        }

        // GET api/<GymController>/5
        [HttpGet("api/Gym/{id}", Name = "GetAGym")]
        public async Task<List<Gym>> Get(int id)
        {
            GymDatabase myDatabase = new();
            return await myDatabase.GetAGym(id);

        }

        // POST api/<GymController>
        [HttpPost]
        public async Task Post([FromBody] Gym value)
        {
            GymDatabase myDatabase = new();
            await myDatabase.SendAGym(value);

        }

        // PUT api/<GymController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Gym value)
        {
            GymDatabase myDatabase = new();
            await myDatabase.EditAGym(value, id);
        }

        // DELETE api/<GymController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            GymDatabase myDatabase = new();
            await myDatabase.DeleteAGym(id);
        }
    }
}
