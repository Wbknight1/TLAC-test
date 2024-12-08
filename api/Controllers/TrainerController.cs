using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Databases;
using api.Databases.api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainerController : ControllerBase
    {
        // GET: api/Trainer
        [HttpGet]
        public async Task<List<Trainer>> Get()
        {
            TrainerDatabase myDatabase = new();
            return await myDatabase.GetAllTrainers();
        }

        // GET api/<TrainerController>/5
        [HttpGet("api/Trainer/{id}", Name = "GetATrainer")]
        public async Task<List<Trainer>> Get(int id)
        {
            TrainerDatabase myDatabase = new();
            return await myDatabase.GetATrainer(id);
        }

        // POST api/<TrainerController>
        [HttpPost]
        public async Task Post([FromBody] Trainer value)
        {
        
            TrainerDatabase myDatabase = new();
            await myDatabase.SendATrainer(value);
        }

        // PUT api/<TrainerController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Trainer value)
        {

            TrainerDatabase myDatabase = new();
            await myDatabase.EditATrainer(value, id);

        }

        // DELETE api/<TrainerController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            TrainerDatabase myDatabase = new();
            await myDatabase.DeleteATrainer(id);
        }
    }
}
