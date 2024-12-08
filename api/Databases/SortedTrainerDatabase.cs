using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using api.Models;
using MySqlConnector;
using static Azure.Core.HttpHeader;

namespace api.Databases
{
    public class SortedTrainerDatabase : Database
    {
        public async Task<List<SortedTrainer>> GetTrainers()
        {
            string sql = @"Select 
                t.FName,
                t.LName,
                t.SpecialityGroup,
                Round(Coalesce(Avg(r.RatingNumber), 0), 2) as AverageRating
            From Trainer t Left Join Rating r on t.TrainerID = r.TrainerID
            Group by t.TrainerID, t.FName, t.LName, t.SpecialityGroup
            Order by t.SpecialityGroup Asc, AverageRating Desc;";

            List<MySqlParameter> parms = new();
            return await GetTopTrainer(sql, parms);
        }

        public async Task<List<SortedTrainer>> GetTopTrainer(string sql, List<MySqlParameter> parms)
        {
            List<SortedTrainer> myData = new();
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
                myData.Add(new SortedTrainer()
                {
                    FName = reader.GetString(0),
                    LName = reader.GetString(1),
                    SpecialityGroup = reader.GetString(2),
                    AverageRating = reader.GetDouble(3)
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();

        }

    }

}

