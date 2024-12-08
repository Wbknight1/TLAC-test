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
            string sql = @$"UPDATE `Gym` SET `Address` = @Address, `GymCost` = @GymCost, `GymName` = @GymName WHERE (`CheckOutID` = @CheckOutID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CheckOutID", MySqlDbType.Int32) { Value = CheckOutID });
            parms.Add(new MySqlParameter("@Address", MySqlDbType.String) { Value = gym.Address });
            parms.Add(new MySqlParameter("@GymCost", MySqlDbType.Double) { Value = gym.GymCost });
            parms.Add(new MySqlParameter("@GymName", MySqlDbType.String) { Value = gym.GymName });
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
            try 
            {
                string sql = @"SELECT 
                    CheckOutID,
                    GymCost,
                    Address,
                    GymName
                    FROM Gym
                    ORDER BY CheckOutID";
                
                List<MySqlParameter> parms = new();
                return await SelectGym(sql, parms);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllGyms(): {ex.Message}");
                throw;
            }
        }

        public async Task SendAGym(Gym myData)
        {
            string sql = @"INSERT INTO `Gym` (`Address`, `GymCost`, `GymName`)
                           VALUES (@Address, @GymCost, @GymName);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@Address", MySqlDbType.String) { Value = myData.Address });
            parms.Add(new MySqlParameter("@GymCost", MySqlDbType.Double) { Value = myData.GymCost });
            parms.Add(new MySqlParameter("@GymName", MySqlDbType.String) { Value = myData.GymName });
            await dataNoReturnSql(sql, parms);
        }

        // All API calls relating to Gym

        private async Task<List<Gym>> SelectGym(string sql, List<MySqlParameter> parms)
        {
            List<Gym> myData = new();
            try
            {
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
                    myData.Add(new Gym
                    {
                        CheckOutID = reader.GetInt32("CheckOutID"),
                        GymCost = reader.GetDouble("GymCost"),
                        Address = reader.GetString("Address"),
                        GymName = reader.GetString("GymName")
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SelectGym(): {ex.Message}");
                throw;
            }
            return myData;
        }
    }
}