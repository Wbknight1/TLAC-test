using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class AvailabilityTable
    {
        
        public int AvaiibtyID {get; set;}

        public int TrainerID {get; set;}

        public string DayOfWeek {get; set;}

        public TimeSpan StartTime {get; set;}

        public TimeSpan EndTime {get; set;}
    

    }
}