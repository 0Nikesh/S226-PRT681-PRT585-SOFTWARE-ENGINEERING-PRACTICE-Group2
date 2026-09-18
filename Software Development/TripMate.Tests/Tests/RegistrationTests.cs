[Test]
public void User_ShouldRegister_WithValidInformation()
{
    driver.Navigate().GoToUrl(
        "http://localhost:3000/register"
    );

    driver.FindElement(By.Id("name"))
        .SendKeys("Test User");

    driver.FindElement(By.Id("email"))
        .SendKeys("testuser123@example.com");

    driver.FindElement(By.Id("phone"))
        .SendKeys("0412345678");

    driver.FindElement(By.Id("country"))
        .SendKeys("Australia");

    driver.FindElement(By.Id("password"))
        .SendKeys("Password123");

    driver.FindElement(By.Id("confirm-password"))
        .SendKeys("Password123");

    driver.FindElement(By.Id("register-button"))
        .Click();

    var dashboard =
        driver.FindElement(By.Id("dashboard"));

    Assert.That(
        dashboard.Displayed,
        Is.True
    );
}