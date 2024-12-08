using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Top5Trainer
    {
         public int TrainerID { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public double AvgRating { get; set; }
    }
}