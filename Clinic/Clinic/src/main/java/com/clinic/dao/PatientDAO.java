package main.java.com.clinic.dao;

import main.java.com.clinic.models.Patient;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PatientDAO {
    public List<Patient> getAllPatients() {
        List<Patient> patients = new ArrayList<>();
        String sql = "SELECT * FROM patients";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                patients.add(new Patient(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDate("dob"),
                    rs.getString("contact_info")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return patients;
    }

    public boolean addPatient(Patient patient) {
        String sql = "INSERT INTO patients (name, dob, contact_info) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, patient.getName());
            stmt.setDate(2, new java.sql.Date(patient.getDob().getTime()));
            stmt.setString(3, patient.getContactInfo());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public Patient getPatientById(int patientId) {
        String sql = "SELECT * FROM patients WHERE id = ?";
        Patient patient = null;
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, patientId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                patient = new Patient(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDate("dob"),
                    rs.getString("contact_info")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return patient;
    }

    // Add update and delete methods as needed
}