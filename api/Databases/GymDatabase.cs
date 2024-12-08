using api.Models;
using MySqlConnector;

namespace api.Databases
{
    public class GymDatabase : Database
    {

        public async Task DeleteAGym(int CheckOutID)
        {
            string sql = $"DELETE FROM `Gym` WHERE (`CheckOutID` = @CheckOutID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CheckOutID", MySqlDbType.Int32) { Value = CheckOutID });
            await dataNoReturnSql(sql, parms);
        }

        public async Task EditAGym(Gym gym, int CheckOutID)
        {
            string sql = @$"UPDATE `Gym` SET `Address` = @Address, `GymCost` = @GymCost WHERE (`CheckOutID` = @CheckOutID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CheckOutID", MySqlDbType.Int32) { Value = CheckOutID });
            parms.Add(new MySqlParameter("@Address", MySqlDbType.String) { Value = gym.Address });
            parms.Add(new MySqlParameter("@GymCost", MySqlDbType.Double) { Value = gym.GymCost });
            await dataNoReturnSql(sql, parms);
        }

        public async Task<List<Gym>> GetAGym(int CheckOutID)
        {
            string sql = $"SELECT * FROM Gym WHERE CheckOutID = @CheckOutID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CheckOutID", MySqlDbType.Int32) { Value = CheckOutID });
            return await SelectGym(sql, parms);
        }

        public async Task<List<Gym>> GetAllGyms()
        {
            string sql = "SELECT * FROM Gym";
            List<MySqlParameter> parms = new();
            return await SelectGym(sql, parms);
        }

        public async Task SendAGym(Gym myData)
        {
            string sql = @"INSERT INTO `Gym` (`Address`, `GymCost`)
                           VALUES (@Address, @GymCost);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@Address", MySqlDbType.String) { Value = myData.Address });
            parms.Add(new MySqlParameter("@GymCost", MySqlDbType.Double) { Value = myData.GymCost });
            await dataNoReturnSql(sql, parms);
        }






        // All API calls relating to Gym

        public async Task<List<Gym>> SelectGym(string sql, List<MySqlParameter> parms)
        {
            List<Gym> myData = new();
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
                myData.Add(new Gym()
                {
                    CheckOutID = reader.GetInt32(0),
                    GymCost = reader.GetDouble(1),
                    Address = reader.GetString(2),
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();

        }
    }
}