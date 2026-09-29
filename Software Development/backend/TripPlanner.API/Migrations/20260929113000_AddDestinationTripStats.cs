using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using TripPlanner.API.Data;

#nullable disable

namespace TripPlanner.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260929113000_AddDestinationTripStats")]
    public partial class AddDestinationTripStats : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "MinPrice",
                table: "Destinations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxPrice",
                table: "Destinations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "AverageVisitorsPerWeek",
                table: "Destinations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "BestSeason",
                table: "Destinations",
                type: "varchar(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Destinations",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Destinations",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "MinPrice", table: "Destinations");
            migrationBuilder.DropColumn(name: "MaxPrice", table: "Destinations");
            migrationBuilder.DropColumn(name: "AverageVisitorsPerWeek", table: "Destinations");
            migrationBuilder.DropColumn(name: "BestSeason", table: "Destinations");
            migrationBuilder.DropColumn(name: "Description", table: "Destinations");
            migrationBuilder.DropColumn(name: "ImageUrl", table: "Destinations");
        }
    }
}
