using api.Models;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace api.Databases
{
    public class AdminDatabase : Database
    {

        private async Task<List<Admin>> SelectAdmin(string sql, List<MySqlParameter> parms)
        {
            List<Admin> myData = new();
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
                myData.Add(new Admin()
                {
                    AdminID = reader.GetInt32(0),
                    Password = reader.GetString(1),
                    Username = reader.GetString(2),
                    AccountType = reader.GetString(3)
                });
            }

            return myData;

            connection.Close();
            connection.CloseAsync();



        }

        public async Task<List<Admin>> GetAllAdmins()
        {
            string sql = "SELECT * FROM Admin";
            List<MySqlParameter> parms = new();
            return await SelectAdmin(sql, parms);

        }

        public async Task<List<Admin>> GetAnAdmin(int AdminID)
        {
            string sql = $"SELECT * FROM Admin WHERE AdminID = @AdminID";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AdminID", MySqlDbType.Int32) { Value = AdminID });
            return await SelectAdmin(sql, parms);

        }

        public async Task SendAnAdmin(Admin myData)
        {
            string sql = @"INSERT INTO `Admin` (`Password`, `Username`, `AdminID`, `AccountType`)
                           VALUES (@Password, @Username, @AdminID, @AccountType);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = myData.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.String) { Value = myData.Username });
            parms.Add(new MySqlParameter("@AdminID", MySqlDbType.Int32) { Value = myData.AdminID });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = myData.AccountType });
            await dataNoReturnSql(sql, parms);

        }

        public async Task EditAnAdmin(Admin admin, int AdminID)
        {
            string sql = @$"UPDATE `Admin` SET `Password` = @Password, `Username` = @Username, `AccountType` = @AccountType WHERE (`AdminID` = @AdminID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AdminID", MySqlDbType.Int32) { Value = AdminID });
            parms.Add(new MySqlParameter("@Password", MySqlDbType.String) { Value = admin.Password });
            parms.Add(new MySqlParameter("@Username", MySqlDbType.String) { Value = admin.Username });
            parms.Add(new MySqlParameter("@AccountType", MySqlDbType.String) { Value = admin.AccountType });
            await dataNoReturnSql(sql, parms);

        }

        public async Task DeleteAnAdmin(int AdminID)
        {
            string sql = $"DELETE FROM `Admin` WHERE (`AdminID` = @AdminID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@AdminID", MySqlDbType.Int32) { Value = AdminID });
            await dataNoReturnSql(sql, parms);

        }

    }
}
