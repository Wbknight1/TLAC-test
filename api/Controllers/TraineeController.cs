using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TraineeController : ControllerBase
    {
        // GET: api/trainee
        [HttpGet]
        public async Task<List<Trainee>> Get()
        {
            TraineeDatabase myDatabase = new();
            return await myDatabase.GetAllTrainee();
        }

        // GET api/<TraineeController>/5
        [HttpGet("api/Trainee/{id}", Name = "GetATrainee")]
        public async Task<List<Trainee>> Get(int CustomerID)
        {
            TraineeDatabase myDatabase = new();
            return await myDatabase.GetATrainee(CustomerID);
        }

        // POST api/<TraineeController>
        [HttpPost]
        public async Task Post([FromBody] Trainee value)
        {
            Console.WriteLine(value.LName);
            Console.WriteLine(value.Email);
            Console.WriteLine(value.CustomerID);

            TraineeDatabase myDatabase = new();
            await myDatabase.SendATrainee(value);
        }

        // PUT api/<TraineeController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Trainee value)
        {
            TraineeDatabase myDatabase = new();
            await myDatabase.EditATrainee(value, id);
        }

        // DELETE api/<TraineeController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            TraineeDatabase myDatabase = new();
            await myDatabase.DeleteATrainee(id);
        }
    }
}
