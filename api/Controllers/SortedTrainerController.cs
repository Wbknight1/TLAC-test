using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Databases;
using api.Models;
using Microsoft.AspNetCore.Mvc;
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SortedTrainerController : ControllerBase
    {
        
        [HttpGet]
        public async Task<List<SortedTrainer>> Get()
        {
            SortedTrainerDatabase myDatabase = new();
            return await myDatabase.GetTrainers();
        }
    }
}