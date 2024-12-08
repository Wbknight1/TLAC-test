using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Databases
{
    public class TransactionDatabase : Database
    {

        private async Task<List<Transaction>> SelectTransaction(string sql, List<MySqlParameter> parms)
        {
            List<Transaction> myData = new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if (parms != null)
            {
                command.Parameters.AddRange(parms.ToArray());
            }

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                myData.Add(new Transaction()
                {
                    TransactionID = reader.GetInt32(0),
                    SessionDate = reader.GetDateTime(1),
                    CheckOutDate = reader.GetDateTime(2),
                    TrainerID = reader.GetInt32(3),
                    CustomerID = reader.GetInt32(4),
                    GymID = reader.GetInt32(5),
                    PendingStatus = reader.GetInt32(6)
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();
        

        }

        public async Task<List<Transaction>> GetAllTransactions()
        {
            string sql = "SELECT * FROM Transaction";
            List<MySqlParameter> parms = new();
            return await SelectTransaction(sql, parms);
        }

        public async Task<List<Transaction>> GetATransaction(int TransactionID)
        {
            string sql = $"SELECT * FROM Transaction WHERE TransactionID = @TransactionID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TransactionID", MySqlDbType.Int32) { Value = TransactionID });
            return await SelectTransaction(sql, parms);
        }



        public async Task<List<Transaction>> GetATransactionByCustID(int CustomerID)
        {
            string sql = $"SELECT * FROM Transaction WHERE CustomerID = @CustomerID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = CustomerID });
            return await SelectTransaction(sql, parms);
        }

        public async Task SendATransaction(Transaction myData)
        {
            string sql = @"INSERT INTO `Transaction` (`TransactionID`, `CustomerID`, `TrainerID`, `GymID`, `SessionDate`, `CheckOutDate`,`PendingStatus`)
                           VALUES (@TransactionID, @CustomerID, @TrainerID, @GymID, @SessionDate, @CheckOutDate, @PendingStatus);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TransactionID", MySqlDbType.Int32) { Value = myData.TransactionID });
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = myData.CustomerID });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = myData.TrainerID });
            parms.Add(new MySqlParameter("@GymID", MySqlDbType.Int32) { Value = myData.GymID });
            parms.Add(new MySqlParameter("@SessionDate", MySqlDbType.DateTime) { Value = myData.SessionDate });
            parms.Add(new MySqlParameter("@CheckOutDate", MySqlDbType.DateTime) { Value = myData.CheckOutDate });
            parms.Add(new MySqlParameter("@PendingStatus", MySqlDbType.Int32) { Value = myData.PendingStatus });
            await dataNoReturnSql(sql, parms);
        }

        public async Task EditATransaction(Transaction transaction, int TransactionID)
        {
            string sql = @$"UPDATE `Transaction` SET `CustomerID` = @CustomerID, `TrainerID` = @TrainerID, `GymID` = @GymID, `SessionDate` = @SessionDate, `CheckOutDate` = @CheckOutDate, `PendingStatus` =@PendingStatus WHERE (`TransactionID` = @TransactionID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = transaction.CustomerID });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = transaction.TrainerID });
            parms.Add(new MySqlParameter("@GymID", MySqlDbType.Int32) { Value = transaction.GymID });
            parms.Add(new MySqlParameter("@SessionDate", MySqlDbType.DateTime) { Value = transaction.SessionDate });
            parms.Add(new MySqlParameter("@CheckOutDate", MySqlDbType.DateTime) { Value = transaction.CheckOutDate });
            parms.Add(new MySqlParameter("@PendingStatus", MySqlDbType.Int32) { Value = transaction.PendingStatus });

            await dataNoReturnSql(sql, parms);
        }

        public async Task DeleteATransaction(int TransactionID)
        {
            string sql = $"DELETE FROM `Transaction` WHERE (`TransactionID` = @TransactionID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TransactionID", MySqlDbType.Int32) { Value = TransactionID });
            await dataNoReturnSql(sql, parms);
        }


    }
}
