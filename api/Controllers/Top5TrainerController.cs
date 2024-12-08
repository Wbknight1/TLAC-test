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
    public class Top5TrainerController : ControllerBase
    {
        

        [HttpGet("all-time")]
        public async Task<List<Top5Trainer>> Get()
        {
            Top5TrainerDatabase myDatabase = new();
            return await myDatabase.GetAllTop5TrainersAllTime();
        }

        [HttpGet("past-month")]
        public async Task<List<Top5Trainer>> GetPastMonth()
        {
            Top5TrainerDatabase myDatabase = new();
            return await myDatabase.GetAllTop5TrainersPastMonth();
        }

        [HttpGet("past-year")]
        public async Task<List<Top5Trainer>> GetPastYear()
        {
            Top5TrainerDatabase myDatabase = new();
            return await myDatabase.GetAllTop5TrainersPastYear();
        }
    }
}