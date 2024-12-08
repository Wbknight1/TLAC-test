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
    public class RevenueController : ControllerBase
    {
        
        [HttpGet("all-time-revenue")]
        public async Task<List<Revenue>> Get()
        {
            RevenueDatabase myDatabase = new();
            return await myDatabase.GetTotalRevenueAllTime();
        }

        [HttpGet("past-month-revenue")]
        public async Task<List<Revenue>> GetPastMonth()
        {
            RevenueDatabase myDatabase = new();
            return await myDatabase.GetTotalRevenuePastMonth();
        }

        [HttpGet("past-year-revenue")]
        public async Task<List<Revenue>> GetPastYear()
        {
            RevenueDatabase myDatabase = new();
            return await myDatabase.GetTotalRevenuePastYear();
        }
    }
}

