using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Trainer
    {
        public int TrainerID { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string SpecialityGroup { get; set; }
        public double Cost { get; set; }

        public int AcceptanceStatus{get; set;}

        public string AccountType{get; set;}

    }
}