using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySqlConnector;
using api.Models;




namespace api.Databases
{
    public class RevenueDatabase : Database
    {
    
        public async Task<List<Revenue>> GetTopTotalRevenue(string sql, List<MySqlParameter> parms)
        {
            List<Revenue> myData = new();
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
                myData.Add(new Revenue()
                {
                    TotalRevenue = reader.GetDouble(0)
                });
            }

            return myData;
            connection.Close();
            connection.CloseAsync();

        }


        public async Task<List<Revenue>> GetTotalRevenuePastYear()
        {
            string sql = @"Select 
                Round(Sum(g.GymCost),2) as TotalRevenue
            From Transaction tr Join Gym g on tr.GymID = g.CheckOutID
            Where tr.CheckOutDate >= Curdate() - Interval 1 Year;";

            List<MySqlParameter> parms = new();
            return await GetTopTotalRevenue(sql, parms);
        }

        public async Task<List<Revenue>> GetTotalRevenuePastMonth()
        {
            string sql = @"Select 
                Round(Sum(g.GymCost),2) as TotalRevenue
            From Transaction tr Join Gym g on tr.GymID = g.CheckOutID
            Where tr.CheckOutDate >= Curdate() - Interval 1 Month;";

            List<MySqlParameter> parms = new();
            return await GetTopTotalRevenue(sql, parms);
        }

        public async Task<List<Revenue>> GetTotalRevenueAllTime()
        {
            string sql = @"Select 
                Round(Sum(g.GymCost),2) as TotalRevenue
            From Transaction tr Join Gym g on tr.GymID = g.CheckOutID;
            ";

            List<MySqlParameter> parms = new();
            return await GetTopTotalRevenue(sql, parms);
        }
    }
}