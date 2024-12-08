using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using MySqlConnector;
 
 
namespace api.Databases
{
    public class RatingDatabase : Database
    {
            
 
        public async Task DeleteARating(int CustomerId)
        {
            string sql = $"DELETE FROM `wd6sdqqskqalug7h`.`Rating` WHERE (`RatingID` = @RatingID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@RatingID", MySqlDbType.Int32) { Value = CustomerId });
            await dataNoReturnSql(sql, parms);
        }
 
        public async Task EditARating(Rating Rating, int RatingID)
        {
 
            string sql = @$"UPDATE `wd6sdqqskqalug7h`.`Rating` SET `RatingNumber` = @RatingNumber, `TrainerID` = @TrainerID WHERE (`RatingID` = @RatingID);";
 
 
            Console.WriteLine(sql);
 
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@RatingID", MySqlDbType.Int32) { Value = Rating.RatingID });
            parms.Add(new MySqlParameter("@RatingNumber", MySqlDbType.Double) { Value = Rating.RatingNumber });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = Rating.TrainerID });
            await dataNoReturnSql(sql, parms);
 
 
        }
 
        public async Task<List<Rating>> GetAllRating()
        {
            string sql = "SELECT * FROM Rating";
            List<MySqlParameter> parms = new();
            return await SelectRating(sql, parms);
        }

 
 
        public async Task SendARating(Rating Rating)
        {
            string sql = @"INSERT INTO `wd6sdqqskqalug7h`.`Rating` (`RatingNumber`, `TrainerID`)
               VALUES (@RatingNumber, @TrainerID);";
 
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@RatingNumber", MySqlDbType.Double) { Value = Rating.RatingNumber});
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = Rating.TrainerID });
            await dataNoReturnSql(sql, parms);
 
 
        }
 
 
        // All api call relating to rating
 
        private async Task<List<Rating>> SelectRating(string sql, List<MySqlParameter> parms)
        {
 
            List<Rating> myData = new();
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
 
                myData.Add(new Rating()
                {
                    RatingID = reader.GetInt32(0),
                    RatingNumber = reader.GetDouble(1),
                    TrainerID = reader.GetInt32(2)
 
                });
 
            }
 
            return myData;

            connection.Close();
            connection.CloseAsync();

        }
 
    }
}