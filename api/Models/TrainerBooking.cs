using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TrainerBooking
    {
        public int BookingID { get; set; }
        public int TrainerID { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int CustomerID { get; set; }
        public int GymID { get; set; }


// Not in MySQL Database
        public string TrainerName { get; set; }
        public string CustomerName { get; set; }
        public string GymAddress { get; set; }

        
    }
}