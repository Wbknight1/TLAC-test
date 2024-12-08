using api.Models;
using MySqlConnector;

namespace api.Databases.api.Databases
{
    public class TrainerDatabase : Database
    {
        public async Task DeleteATrainer(int TrainerID)
        {
            string sql = $"DELETE FROM `Trainer` WHERE (`TrainerID` = @TrainerID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@id", MySqlDbType.Int32) { Value = TrainerID });
            await dataNoReturnSql(sql, parms);

        }

        public async Task EditATrainer(Trainer trainer, int TrainerID)
        {
            string sql = @$"UPDATE `Trainer` SET `Password` = @Password, `Username` = @Username, `Email` = @Email, `FName` = @FName, `LName` = @LName, `SpecialityGroup` = @SpecialityGroup, `Cost`= @Cost, `AcceptanceStatus` = @AcceptanceStatus, `AccountType`=@AccountType WHERE (`TrainerID` = @TrainerID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = TrainerID });
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = trainer.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.String) { Value = trainer.Username });
            parms.Add(new MySqlParameter("@Email", MySqlDbType.String) { Value = trainer.Email });
            parms.Add(new MySqlParameter("@FName", MySqlDbType.String) { Value = trainer.FName });
            parms.Add(new MySqlParameter("@LName", MySqlDbType.String) { Value = trainer.LName });
            parms.Add(new MySqlParameter("@SpecialityGroup", MySqlDbType.String) { Value = trainer.SpecialityGroup });
            parms.Add(new MySqlParameter("@Cost", MySqlDbType.Double) { Value = trainer.Cost });
            parms.Add(new MySqlParameter("@AcceptanceStatus", MySqlDbType.Int32) { Value = trainer.AcceptanceStatus });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = trainer.AccountType });
            await dataNoReturnSql(sql, parms);

        }

        public async Task<List<Trainer>> GetAllTrainers()
        {
            string sql = "SELECT * FROM Trainer;";
            List<MySqlParameter> parms = new();
            return await SelectTrainer(sql, parms);

        }

        public async Task<List<Trainer>> GetATrainer(int TrainerID)
        {
            string sql = $"SELECT * FROM Trainer WHERE TrainerID = @TrainerID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = TrainerID });
            return await SelectTrainer(sql, parms);

        }

        public async Task SendATrainer(Trainer myData)
        {
            string sql = @"INSERT INTO `Trainer` (`Password`, `Username`, `Email`, `FName`, `LName`, `SpecialityGroup`, `Cost`, `AcceptanceStatus`, `AccountType`)
                               VALUES (@Password, @Username, @Email, @FName, @LName, @SpecialityGroup, @Cost, @AcceptanceStatus, @AccountType);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = myData.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.String) { Value = myData.Username });
            parms.Add(new MySqlParameter("@Email", MySqlDbType.String) { Value = myData.Email });
            parms.Add(new MySqlParameter("@FName", MySqlDbType.String) { Value = myData.FName });
            parms.Add(new MySqlParameter("@LName", MySqlDbType.String) { Value = myData.LName });
            parms.Add(new MySqlParameter("@SpecialityGroup", MySqlDbType.String) { Value = myData.SpecialityGroup });
            parms.Add(new MySqlParameter("@Cost", MySqlDbType.Double) { Value = myData.Cost });
            parms.Add(new MySqlParameter("@AcceptanceStatus", MySqlDbType.Int32) { Value = myData.AcceptanceStatus });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = myData.AccountType });
            await dataNoReturnSql(sql, parms);

        }

        private async Task<List<Trainer>> SelectTrainer(string sql, List<MySqlParameter> parms)
        {
            List<Trainer> myData = new();
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
                myData.Add(new Trainer()
                {
                    TrainerID = reader.GetInt32(0),
                    Password = reader.GetString(1),
                    Username = reader.GetString(2),
                    Email = reader.GetString(3),
                    FName = reader.GetString(4),
                    LName = reader.GetString(5),
                    SpecialityGroup = reader.GetString(6),
                    Cost = reader.GetDouble(7),
                    AcceptanceStatus=reader.GetInt32(8),
                    AccountType=reader.GetString(9)
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();
        }

        
    }
}