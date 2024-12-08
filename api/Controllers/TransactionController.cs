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
    public class TransactionController : ControllerBase
    {
        // GET: api/<TransactionController>
        [HttpGet]
        public async Task<List<Transaction>> Get()
        {
            TransactionDatabase myDatabase = new();
            return await myDatabase.GetAllTransactions();

        }

        // GET api/<TransactionController>/5
        [HttpGet("byCustomer/{id}", Name = "GetATransactionByCustID")]
        public async Task<List<Transaction>> Get(int id)
        {
            TransactionDatabase myDatabase = new();
            return await myDatabase.GetATransactionByCustID(id);
        }

        [HttpGet("{id}", Name = "GetATransaction")]

        public async Task<List<Transaction>> GetATransaction(int id)
        {
            TransactionDatabase myDatabase = new();
            return await myDatabase.GetATransaction(id);
        }

        // POST api/<TransactionController>
        [HttpPost]
        public async Task Post([FromBody] Transaction value)
        {
            TransactionDatabase myDatabase = new();
            await myDatabase.SendATransaction(value);
        }

        // PUT api/<TransactionController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Transaction value)
        {
            TransactionDatabase myDatabase = new();
            await myDatabase.EditATransaction(value, id);
        }

        // DELETE api/<TransactionController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            TransactionDatabase myDatabase = new();
            await myDatabase.DeleteATransaction(id);
        }
    }
}
