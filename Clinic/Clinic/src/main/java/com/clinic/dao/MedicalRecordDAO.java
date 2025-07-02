package main.java.com.clinic.dao;

import main.java.com.clinic.models.MedicalRecord;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MedicalRecordDAO {
    public List<MedicalRecord> getRecordsByPatient(int patientId) {
        List<MedicalRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM records WHERE patient_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, patientId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                records.add(new MedicalRecord(
                    rs.getInt("id"),
                    rs.getInt("patient_id"),
                    rs.getInt("doctor_id"),
                    rs.getDate("date"),
                    rs.getString("notes"),
                    rs.getString("prescriptions")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return records;
    }

    public boolean addMedicalRecord(MedicalRecord record) {
        String sql = "INSERT INTO records (patient_id, doctor_id, date, notes, prescriptions) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, record.getPatientId());
            stmt.setInt(2, record.getDoctorId());
            stmt.setDate(3, new java.sql.Date(record.getDate().getTime()));
            stmt.setString(4, record.getNotes());
            stmt.setString(5, record.getPrescriptions());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public List<MedicalRecord> getRecordsByDoctor(int doctorId) {
        List<MedicalRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM records WHERE doctor_id = ? ORDER BY date DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, doctorId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                MedicalRecord record = new MedicalRecord(
                    rs.getInt("id"),
                    rs.getInt("patient_id"),
                    rs.getInt("doctor_id"),
                    rs.getDate("date"),
                    rs.getString("notes"),
                    rs.getString("prescriptions")
                );
                records.add(record);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return records;
    }

    // Add update and delete methods as needed
}