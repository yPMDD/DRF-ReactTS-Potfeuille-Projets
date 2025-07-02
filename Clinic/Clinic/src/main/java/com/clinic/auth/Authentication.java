package main.java.com.clinic.auth;

import main.java.com.clinic.dao.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Authentication {
    public static User authenticate(String username, String password) {
        String sql = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
	        
	        		
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.setString(2, password);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                int id = rs.getInt("id");
                String dbUsername = rs.getString("username");
                String role = rs.getString("role");
                
                return new User(id, dbUsername, role);
            }
        } catch (SQLException e) {
        	
            e.printStackTrace();
        }
        
        return null;
    }
}