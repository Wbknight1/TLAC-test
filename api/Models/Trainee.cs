using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Trainee
    {
        public int CustomerID { get; set; }

        public string Password { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string FName { get; set; }

        public string LName { get; set; }

        public string WorkOutPreference { get; set; }

        public string AccountType{get; set;}


    }
}