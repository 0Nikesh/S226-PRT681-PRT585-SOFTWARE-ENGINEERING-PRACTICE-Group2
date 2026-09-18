using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace TripPlanner.Tests
{
    public class LoginTests
    {
        private IWebDriver driver;

        public void Setup()
        {
            driver = new ChromeDriver();

            driver.Manage().Window.Maximize();

            driver.Navigate().GoToUrl(
                "https://localhost:3000/login"
            );
        }

        [Test]
        public void LoginPage_ShouldOpen()
        {
            Assert.That(
                driver.Title,
                Does.Contain("TripPlanner")
            );
        }

        [TearDown]
        public void TearDown()
        {
            driver.Quit();
        }
    }
}