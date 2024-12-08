using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Transaction
    {

        public int TransactionID { get; set; }

        public DateTime SessionDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public int TrainerID { get; set; }

        public int CustomerID { get; set; }

        public int GymID { get; set; }

        public int PendingStatus {get; set;}

    }
}



