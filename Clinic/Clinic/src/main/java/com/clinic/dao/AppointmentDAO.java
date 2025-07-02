package main.java.com.clinic.dao;

import main.java.com.clinic.models.Appointment;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class AppointmentDAO {
	public List<Appointment> getAppointmentsByDoctor(int doctorId) {
	    List<Appointment> appointments = new ArrayList<>();
	    String sql = "SELECT * FROM appointments WHERE doctor_id = ? AND status != 'CANCELLED' ORDER BY datetime";
	    
	    try (Connection conn = DatabaseConnection.getConnection();
	         PreparedStatement stmt = conn.prepareStatement(sql)) {
	        
	        stmt.setInt(1, doctorId);
	        ResultSet rs = stmt.executeQuery();
	        
	        while (rs.next()) {
	            appointments.add(new Appointment(
	                rs.getInt("id"),
	                rs.getInt("patient_id"),
	                rs.getInt("doctor_id"),
	                rs.getTimestamp("datetime"),
	                rs.getString("status")
	            ));
	        }
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }
	    
	    return appointments;
	}

    public boolean addAppointment(Appointment appointment) {
        String sql = "INSERT INTO appointments (patient_id, doctor_id, datetime, status) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, appointment.getPatientId());
            stmt.setInt(2, appointment.getDoctorId());
            stmt.setTimestamp(3, new java.sql.Timestamp(appointment.getDatetime().getTime()));
            stmt.setString(4, appointment.getStatus());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public int getPatientIdByAppointmentId(int appointmentId) {
        String sql = "SELECT patient_id FROM appointments WHERE id = ?";
        int patientId = -1; // Return -1 if not found
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, appointmentId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                patientId = rs.getInt("patient_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return patientId;
    }
    public List<Appointment> getAppointmentsByDate(Date date) {
        List<Appointment> appointments = new ArrayList<>();
        
        // Convert Date to start and end of day for the query
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startDate = calendar.getTime();
        
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        Date endDate = calendar.getTime();
        
        String sql = "SELECT * FROM appointments WHERE datetime BETWEEN ? AND ? ORDER BY datetime";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, new java.sql.Timestamp(startDate.getTime()));
            stmt.setTimestamp(2, new java.sql.Timestamp(endDate.getTime()));
            
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Appointment appointment = new Appointment(
                    rs.getInt("id"),
                    rs.getInt("patient_id"),
                    rs.getInt("doctor_id"),
                    rs.getTimestamp("datetime"),
                    rs.getString("status")
                );
                appointments.add(appointment);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return appointments;
    }

    // Add update and delete methods as needed
}