package main.java.com.clinic.dao;

import main.java.com.clinic.models.Doctor;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DoctorDAO {
    public List<Doctor> getAllDoctors() {
        List<Doctor> doctors = new ArrayList<>();
        String sql = "SELECT * FROM doctors";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                doctors.add(new Doctor(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("specialization"),
                    rs.getString("availability")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return doctors;
    }

    public boolean addDoctor(Doctor doctor) {
        String sql = "INSERT INTO doctors (name, specialization, availability) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, doctor.getName());
            stmt.setString(2, doctor.getSpecialization());
            stmt.setString(3, doctor.getAvailability());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public String getDoctorAvailability(int doctorId) {
        String sql = "SELECT availability FROM doctors WHERE id = ?";
        String availability = null;
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, doctorId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                availability = rs.getString("availability");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return availability;
    }
    public boolean updateDoctorAvailability(int doctorId, String newAvailability) {
        String sql = "UPDATE doctors SET availability = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newAvailability);
            stmt.setInt(2, doctorId);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Add update and delete methods as needed
}