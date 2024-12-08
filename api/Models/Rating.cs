using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
 
namespace api.Models
{
    public class Rating
    {
 
        public int RatingID {  get; set; }
        public double RatingNumber { get; set; }
 
        public int TrainerID {get; set;}
 
    }
}