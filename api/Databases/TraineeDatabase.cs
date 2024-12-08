using api.Models;
using MySqlConnector;

namespace api.Databases
{
    public class TraineeDatabase : Database
    {

        public async Task DeleteATrainee(int CustomerId)
        {
            string sql = $"DELETE FROM `wd6sdqqskqalug7h`.`Trainee` WHERE (`CustomerId` = @CustomerId);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CustomerId", MySqlDbType.Int32) { Value = CustomerId });
            await dataNoReturnSql(sql, parms);
        }

        public async Task EditATrainee(Trainee trainee, int CustomerID)
        {

            string sql = @$"UPDATE `wd6sdqqskqalug7h`.`Trainee` SET `Password` = @Password, `Username` = @Username, `Email` = @Email, `FName` = @FName, `LName` = @LName, `WorkOutPreference` = @WorkOutPreference, `AccountType`=@AccountType WHERE (`CustomerID` = @CustomerID);";


            Console.WriteLine(sql);

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.String) { Value = CustomerID });
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = trainee.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.String) { Value = trainee.Username });
            parms.Add(new MySqlParameter("@Email", MySqlDbType.String) { Value = trainee.Email });
            parms.Add(new MySqlParameter("@FName", MySqlDbType.String) { Value = trainee.FName });
            parms.Add(new MySqlParameter("@LName", MySqlDbType.String) { Value = trainee.LName });
            parms.Add(new MySqlParameter("@WorkOutPreference", MySqlDbType.String) { Value = trainee.WorkOutPreference });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = trainee.AccountType });
            await dataNoReturnSql(sql, parms);


        }

        public async Task<List<Trainee>> GetAllTrainee()
        {
            string sql = "SELECT * From `wd6sdqqskqalug7h`.`Trainee`;";
            List<MySqlParameter> parms = new();
            return await SelectTrainee(sql, parms);
        }

        public async Task<List<Trainee>> GetATrainee(int CustomerID)
        {
            string sql = $"SELECT * FROM Trainee WHERE `CustomerID` = @CustomerID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = CustomerID });
            return await SelectTrainee(sql, parms);
        }

        public async Task SendATrainee(Trainee myData)
        {
            string sql = @"INSERT INTO `wd6sdqqskqalug7h`.`Trainee` (`Password`, `Username`, `Email`, `FName` , `LName` , `WorkOutPreference`, `AccountType`)
               VALUES (@Password, @Username, @Email, @FName, @LName, @WorkOutPreference, @AccountType);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = myData.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.DateTime) { Value = myData.Username });
            parms.Add(new MySqlParameter("@Email", MySqlDbType.String) { Value = myData.Email });
            parms.Add(new MySqlParameter("@FName", MySqlDbType.String) { Value = myData.FName });
            parms.Add(new MySqlParameter("@LName", MySqlDbType.String) { Value = myData.LName });
            parms.Add(new MySqlParameter("@WorkOutPreference", MySqlDbType.String) { Value = myData.WorkOutPreference });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = myData.AccountType });
            await dataNoReturnSql(sql, parms);



            // string sql = @"INSERT INTO new_table (name, rating, dubsDate, favorite, delete)
            //    VALUES (@name, @rating, @dubsDate, @favorite, @delete);";

        }


        // All api call relating to trainee

        private async Task<List<Trainee>> SelectTrainee(string sql, List<MySqlParameter> parms)
        {

            List<Trainee> myData = new();
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


                myData.Add(new Trainee()
                {
                    CustomerID = reader.GetInt32(0),
                    Password = reader.GetString(1),
                    Username = reader.GetString(2),
                    Email = reader.GetString(3),
                    FName = reader.GetString(4),
                    LName = reader.GetString(5),
                    WorkOutPreference = reader.GetString(6),
                    AccountType = reader.GetString(7)

                });

            }

            return myData;

            connection.Close();
            connection.CloseAsync();


        }
    }
}