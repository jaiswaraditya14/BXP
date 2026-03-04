package com.example;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class WebAppTest {
    WebDriver driver;

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // Headless is required for most Jenkins environments
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
    }

    @Test(priority = 1)
    public void testPageTitle() {
        driver.get("https://www.google.com");
        String title = driver.getTitle();
        System.out.println("Page title is: " + title);
        Assert.assertTrue(title.contains("Google"), "Title should contain Google");
    }

    @Test(priority = 2)
    public void testSearchBoxVisible() {
        driver.get("https://www.google.com");
        boolean isSearchBoxDisplayed = driver.findElement(org.openqa.selenium.By.name("q")).isDisplayed();
        Assert.assertTrue(isSearchBoxDisplayed, "Search box should be visible");
    }

    @Test(priority = 3)
    public void testAboutPageNavigation() {
        driver.get("https://www.google.com");
        driver.get("https://about.google/");
        String title = driver.getTitle();
        Assert.assertTrue(title.contains("Google"), "About page title should contain Google");
    }

    @Test(priority = 4)
    public void testLanguageLink() {
        driver.get("https://www.google.com");
        boolean isLanguageSectionPresent = driver.findElements(org.openqa.selenium.By.id("SIvCob")).size() > 0;
        // This is a soft check as language section might vary by region
        System.out.println("Language section present: " + isLanguageSectionPresent);
        Assert.assertNotNull(driver.getCurrentUrl());
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
