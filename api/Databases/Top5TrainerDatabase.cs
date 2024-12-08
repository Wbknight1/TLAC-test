using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using MySqlConnector;


namespace api.Databases
{
    public class Top5TrainerDatabase : Database
    {
        public async Task<List<Top5Trainer>> GetTop5Trainers(string sql, List<MySqlParameter> parms)
        {
            List<Top5Trainer> myData = new();
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
                myData.Add(new Top5Trainer()
                {
                    TrainerID = reader.GetInt32(0),
                    Fname = reader.GetString(1),
                    Lname = reader.GetString(2),
                    AvgRating = reader.GetDouble(3)
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();
        
        }

        public async Task<List<Top5Trainer>> GetAllTop5TrainersAllTime()
        {
            string sql = @"Select 
                t.TrainerID,
                t.FName,
                t.LName,
                Round(avg(r.RatingNumber), 2) as AvgRating
            From Trainer t Join  Rating r on t.TrainerID = r.TrainerID
            Group by t.TrainerID
            Order by AvgRating Desc
            Limit 5;";

            List<MySqlParameter> parms = new();
            return await GetTop5Trainers(sql, parms);
        }

        public async Task<List<Top5Trainer>> GetAllTop5TrainersPastMonth()
        {
            string sql = @"Select 
                t.TrainerID,
                t.FName,
                t.LName,
                Round(avg(r.RatingNumber), 2) as AvgRating
            From Trainer t Join Rating r on t.TrainerID = r.TrainerID Join Transaction tr on t.TrainerID = tr.TrainerID
            Where tr.SessionDate >= Curdate() - Interval 1 Month  
            Group by t.TrainerID
            Order by AvgRating Desc
            Limit 5;";

            List<MySqlParameter> parms = new();
            return await GetTop5Trainers(sql, parms);
        }

        public async Task<List<Top5Trainer>> GetAllTop5TrainersPastYear()
        {
            string sql = @"Select 
                t.TrainerID,
                t.FName,
                t.LName,
                Round(avg(r.RatingNumber), 2) as AvgRating
            From Trainer t Join Rating r on t.TrainerID = r.TrainerID Join Transaction tr on t.TrainerID = tr.TrainerID
            Where tr.SessionDate >= Curdate() - Interval 1 Year  
            Group by t.TrainerID
            Order by AvgRating Desc
            Limit 5;";

            List<MySqlParameter> parms = new();
            return await GetTop5Trainers(sql, parms);
        }
    }
}