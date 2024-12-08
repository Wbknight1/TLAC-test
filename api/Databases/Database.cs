using api.Models;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Databases
{
    public abstract class Database
    {
        protected string cs;

        public Database()
        {
            cs = "SERVER =qn0cquuabmqczee2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com;User ID=d2b7qechj9vizjo2; Password = nz7esrg5gb4d0bav; port = 3306; Database =wd6sdqqskqalug7h;";
        }

        public async Task dataNoReturnSql(string sql,List<MySqlParameter> parms)
        {
            List<object> myList= new();
            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();
            using var command = new MySqlCommand(sql, connection);

            if(parms!=null){

                command.Parameters.AddRange(parms.ToArray());
            }
            using var reader = await command.ExecuteReaderAsync();

        }



            
    }
}


