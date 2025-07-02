package main.java.com.clinic.dao;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DatabaseConnection {
	
	private static final String PROPERTIES_FILE = "config.properties";
	
    private static Connection connection = null;

    public static Connection getConnection() {
        Properties prop = new Properties();
        InputStream input = null;
        
        try {
            
            input = DatabaseConnection.class.getClassLoader()
                   .getResourceAsStream("config.properties");
            
            
            if (input == null) {
                String configPath = System.getProperty("user.dir") + 
                                  "/src/main/resources/config.properties";
                input = new FileInputStream(configPath);
            }
            
            if (input == null) {
                throw new RuntimeException("config.properties not found in classpath or " + 
                                         System.getProperty("user.dir"));
            }
            
            prop.load(input);
            Class.forName("com.mysql.cj.jdbc.Driver"); 
            return DriverManager.getConnection(
                prop.getProperty("db.url"),
                prop.getProperty("db.username"),
                prop.getProperty("db.password")
            );
        } catch (Exception e) {
            throw new RuntimeException("Database connection failed", e);
        } finally {
            if (input != null) {
                try { input.close(); } catch (IOException e) { /* ignore */ }
            }
        }
        }
    

    public static void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            if (conn != null) {
                // Try a simple query to verify
                try (Statement stmt = conn.createStatement()) {
                    stmt.executeQuery("SELECT 1"); // Simple test query
                    return true;
                }
            }
        } catch (SQLException e) {
        	
            e.printStackTrace();
        }
        return false;
    }
    
}