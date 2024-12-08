using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Databases;
using api.Databases.api.Databases;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainerBookingController : ControllerBase
    {
        //GET: api/TrainerBooking
        [HttpGet]
        public async Task<List<TrainerBooking>> Get()
        {
            TrainerBookingDatabase myDatabase = new();
    return await myDatabase.GetAllBookings();
} 

//GET: api/TrainerBooking/5
[HttpGet("{id}", Name = "GetATrainerBooking")]
public async Task<List<TrainerBooking>> Get(int id)
{
    TrainerBookingDatabase myDatabase = new();
    return await myDatabase.GetABooking(id);
}

//POST: api/TrainerBooking
[HttpPost]
public async Task Post([FromBody] TrainerBooking value)
{
    TrainerBookingDatabase myDatabase = new();
    await myDatabase.SendABooking(value);
}

//PUT: api/TrainerBooking/5
[HttpPut("{id}")]
public async Task Put(int id, [FromBody] TrainerBooking value)
{
    TrainerBookingDatabase myDatabase = new();
    await myDatabase.EditABooking(value, id);
}

// Delete: api/TrainerBooking/5
[HttpDelete("{id}")]
public async Task Delete(int id)
{
    TrainerBookingDatabase myDatabase = new();
    await myDatabase.DeleteABooking(id);
}
    }
}