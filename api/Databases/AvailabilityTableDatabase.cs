using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Databases
{
    public class AvailabilityTableDatabase : Database
    {
         public async Task EditAAvailabilityTable(AvailabilityTable booking, int AvaiibtyID)
        {
            string sql = @$"UPDATE `AvailabilityTable` SET `TrainerID` = @TrainerID, `DayOfWeek` = @DayOfWeek, `StartTime` = @StartTime, `EndTime` = @EndTime WHERE (`AvaiibtyID` = @AvaiibtyID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AvaiibtyID", MySqlDbType.Int32) { Value = booking.AvaiibtyID });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = booking.TrainerID });
            parms.Add(new MySqlParameter("@DayOfWeek", MySqlDbType.String) { Value = booking.DayOfWeek });
            parms.Add(new MySqlParameter("@StartTime", MySqlDbType.Time) { Value = booking.StartTime });
            parms.Add(new MySqlParameter("@EndTime", MySqlDbType.Time) { Value = booking.EndTime });
            await dataNoReturnSql(sql, parms);
        }

        public async Task<List<AvailabilityTable>> GetAllAvailabilityTable()
        {
            string sql = "SELECT * FROM AvailabilityTable;";
            List<MySqlParameter> parms = new();
            return await SelectAvailabilityTable(sql, parms);
        }

        public async Task<List<AvailabilityTable>> GetAAvailabilityTable(int AvaiibtyID)
        {
            string sql = $"SELECT * FROM AvailabilityTable WHERE AvaiibtyID = @AvaiibtyID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AvailabilityTable", MySqlDbType.Int32) { Value = AvaiibtyID });
            return await SelectAvailabilityTable(sql, parms);
        }

        public async Task SendAAvailabilityTable(AvailabilityTable myData)
        {
            string sql = @"INSERT INTO `AvailabilityTable` (`TrainerID`, `DayOfWeek`, `StartTime`, `EndTime`)
                               VALUES (@TrainerID, @DayOfWeek, @StartTime, @EndTime);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AvaiibtyID", MySqlDbType.Int32) { Value = myData.AvaiibtyID });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = myData.TrainerID });
            parms.Add(new MySqlParameter("@DayOfWeek", MySqlDbType.DateTime) { Value = myData.DayOfWeek });
            parms.Add(new MySqlParameter("@StartTime", MySqlDbType.Time) { Value = myData.StartTime });
            parms.Add(new MySqlParameter("@EndTime", MySqlDbType.Time) { Value = myData.EndTime });
            await dataNoReturnSql(sql, parms);
        }

        private async Task<List<AvailabilityTable>> SelectAvailabilityTable(string sql, List<MySqlParameter> parms)
        {
            List<AvailabilityTable> myData = new();
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
                myData.Add(new AvailabilityTable()
                {
                    AvaiibtyID = reader.GetInt32(0),
                    TrainerID = reader.GetInt32(1),
                    DayOfWeek = reader.GetString(2),
                    StartTime = reader.GetTimeSpan(3),
                    EndTime = reader.GetTimeSpan(4),
                });
            }

            return myData;
            connection.Close();
            connection.CloseAsync();
        }
    }
}