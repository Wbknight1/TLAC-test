// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using api.Databases;
// using api.Databases.api.Databases;
// using api.Models;
// using Microsoft.AspNetCore.Mvc;

// namespace api.Controllers
// {
//     public class AvailabilityTableController : ControllerBase
//     {

//         [HttpGet]
//         public async Task<List<AvailabilityTable>> Get()
//         {
//             AvailabilityTableDatabase myDatabase = new();
//             return await myDatabase.GetAllAvailabilityTable();
//         }

//         // GET api/<TrainerController>/5
//         [HttpGet("api/Trainer/{id}", Name = "GetAAvailabilityTableDatabase")]
//         public async Task<List<AvailabilityTable>> Get(int BookingID)
//         {
//             AvailabilityTableDatabase myDatabase = new();
//             return await myDatabase.GetAAvailabilityTable(BookingID);
//         }

//         // POST api/<TrainerController>
//         [HttpPost]
//         public async Task Post([FromBody] AvailabilityTable value)
//         {
        
//             AvailabilityTableDatabase myDatabase = new();
//             await myDatabase.SendAAvailabilityTable(value);
//         }

//         // PUT api/<TrainerController>/5
//         [HttpPut("{id}")]
//         public async Task Put(int id, [FromBody] AvailabilityTable value)
//         {

//             AvailabilityTableDatabase myDatabase = new();
//             await myDatabase.EditAAvailabilityTable(value, id);

//         }
        
//     }
// }