package main.java.com.clinic.models;

import java.util.Date;

public class Appointment {
    private int id;
    private int patientId;
    private int doctorId;
    private Date datetime;
    private String status;

    public Appointment(int id, int patientId, int doctorId, Date datetime, String status) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.datetime = datetime;
        this.status = status;
    }

    // Getters and Setters
    public int getId() { return id; }
    public int getPatientId() { return patientId; }
    public int getDoctorId() { return doctorId; }
    public Date getDatetime() { return datetime; }
    public String getStatus() { return status; }

    public void setId(int id) { this.id = id; }
    public void setPatientId(int patientId) { this.patientId = patientId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }
    public void setDatetime(Date datetime) { this.datetime = datetime; }
    public void setStatus(String status) { this.status = status; }
}