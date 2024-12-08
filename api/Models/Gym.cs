using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Gym
    {
        public int CheckOutID { get; set; }
        public double GymCost { get; set; }
        public string Address { get; set; }
        public string GymName { get; set; }
    }
}
