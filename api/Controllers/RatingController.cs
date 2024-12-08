using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;
 
namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        // GET: api/RatingF
        [HttpGet(Name = "GetAllRating")]
        public async Task<List<Rating>> Get()
        {
            RatingDatabase myDatabase = new();
            return await myDatabase.GetAllRating();
        }
 
        // POST api/<RatingController>
        [HttpPost]
        public async Task Post([FromBody] Rating value)
        {
 
            RatingDatabase myDatabase = new();
            await myDatabase.SendARating(value);
        }
 
        // PUT api/<RatingController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Rating value)
        {
 
            RatingDatabase myDatabase = new();
            await myDatabase.EditARating(value, id);
 
        }
 
        // DELETE api/<RatingController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            RatingDatabase myDatabase = new();
            await myDatabase.DeleteARating(id);
        }
        
    }
}