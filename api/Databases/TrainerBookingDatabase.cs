using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Databases
{
    public class TrainerBookingDatabase : Database
    {
        public TrainerBookingDatabase() {
            // Add both AllowZeroDateTime and ConvertZeroDateTime
            cs = $"{cs};AllowZeroDateTime=True;ConvertZeroDateTime=True";
        }

        public async Task DeleteABooking(int BookingID) {
            string sql = $"DELETE FROM `TrainerBooking` WHERE (`BookingID` = @BookingID);";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@BookingID", MySqlDbType.Int32) { Value = BookingID });
            await dataNoReturnSql(sql, parms);
        }

        public async Task EditABooking(TrainerBooking booking, int BookingID) {
            string sql = @$"UPDATE `TrainerBooking` SET `TrainerID` = @TrainerID, `BookingDate` = @BookingDate, `StartTime` = @StartTime, `EndTime` = @EndTime, `CustomerID` = @CustomerID WHERE (`BookingID` = @BookingID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@BookingID", MySqlDbType.Int32) { Value = BookingID });
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = booking.TrainerID });
            // Match exact MySQL types
            parms.Add(new MySqlParameter("@BookingDate", MySqlDbType.Date) { Value = booking.BookingDate.Date });    
            parms.Add(new MySqlParameter("@StartTime", MySqlDbType.Time) { Value = booking.StartTime });
            parms.Add(new MySqlParameter("@EndTime", MySqlDbType.Time) { Value = booking.EndTime });
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = booking.CustomerID });
            await dataNoReturnSql(sql, parms);

        }

        public async Task<List<TrainerBooking>> GetAllBookings() {
            string sql = @$" SELECT 
                    tb.BookingID,
                    tb.TrainerID,
                    tb.BookingDate,
                    tb.StartTime,
                    tb.EndTime,
                    tb.CustomerID,
                    CONCAT(tr.FName, ' ', tr.LName) as TrainerName,
                    CONCAT(te.FName, ' ', te.LName) as CustomerName,
                    tb.GymID,
                    g.Address

                    FROM TrainerBooking tb JOIN Trainee te ON tb.CustomerID = te.CustomerID JOIN Trainer tr on tb.TrainerID = tr.TrainerID JOIN Gym g ON tb.GymID = g.CheckOutID
                    GROUP BY tb.CustomerID, tb.TrainerID, tb.BookingID;";
            List<MySqlParameter> parms = new();
            return await SelectBooking(sql, parms);
        }

        public async Task<List<TrainerBooking>> GetABooking(int BookingID) {
            string sql = @$" SELECT 
                    tb.BookingID,
                    tb.TrainerID,
                    tb.BookingDate,
                    tb.StartTime,
                    tb.EndTime,
                    tb.CustomerID,
                    CONCAT(tr.FName, ' ', tr.LName) as TrainerName,
                    CONCAT(te.FName, ' ', te.LName) as CustomerName,
                    tb.GymID,
                    g.Address

                    FROM TrainerBooking tb JOIN Trainee te ON tb.CustomerID = te.CustomerID JOIN Trainer tr on tb.TrainerID = tr.TrainerID JOIN Gym g ON tb.GymID = g.CheckOutID WHERE BookingID = @BookingID
                    GROUP BY tb.CustomerID, tb.TrainerID, tb.BookingID;";
            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@BookingID", MySqlDbType.Int32) { Value = BookingID });
            return await SelectBooking(sql, parms);
        }

        public async Task SendABooking(TrainerBooking myData) {
            string sql = @$"INSERT INTO `TrainerBooking` (`TrainerID`, `BookingDate`, `StartTime`, `EndTime`, `CustomerID`, `GymID`)
                                VALUES (@TrainerID, @BookingDate, @StartTime, @EndTime, @CustomerID, @GymID);";

            List<MySqlParameter> parms = new();
            parms.Add(new MySqlParameter("@TrainerID", MySqlDbType.Int32) { Value = myData.TrainerID });
            // Match exact MySQL types
            parms.Add(new MySqlParameter("@BookingDate", MySqlDbType.Date) { Value = myData.BookingDate.Date });
            parms.Add(new MySqlParameter("@StartTime", MySqlDbType.Time) { Value = myData.StartTime });
            parms.Add(new MySqlParameter("@EndTime", MySqlDbType.Time) { Value = myData.EndTime });
            parms.Add(new MySqlParameter("@CustomerID", MySqlDbType.Int32) { Value = myData.CustomerID });
            parms.Add(new MySqlParameter("@GymID", MySqlDbType.Int32) { Value = myData.GymID });
            await dataNoReturnSql(sql, parms);
        }

        private async Task<List<TrainerBooking>> SelectBooking(string sql, List<MySqlParameter> parms) {
            List<TrainerBooking> toReturn = new();
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
                try
                {
                    var booking = new TrainerBooking()
                    {
                        BookingID = reader.GetInt32("BookingID"),
                        TrainerID = reader.GetInt32("TrainerID"),
                        // Handle date and time fields separately with their correct types
                        BookingDate = reader.GetDateOnly("BookingDate").ToDateTime(TimeOnly.MinValue),
                        StartTime = reader.GetTimeOnly("StartTime").ToTimeSpan(),
                        EndTime = reader.GetTimeOnly("EndTime").ToTimeSpan(),
                        CustomerID = reader.GetInt32("CustomerID"),
                        TrainerName = reader.GetString("TrainerName"),
                        CustomerName = reader.GetString("CustomerName"),
                        GymID = reader.GetInt32("GymID"),
                        GymAddress = reader.GetString("Address")
                    };

                    toReturn.Add(booking);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error reading booking: {ex.Message}");
                    continue; // Skip invalid records
                }
            }

            return toReturn;
        }
    }
}
