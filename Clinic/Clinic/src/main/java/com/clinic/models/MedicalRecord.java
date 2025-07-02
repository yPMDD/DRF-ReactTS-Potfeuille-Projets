package main.java.com.clinic.models;

import java.util.Date;

public class MedicalRecord {
    private int id;
    private int patientId;
    private int doctorId;
    private Date date;
    private String notes;
    private String prescriptions;

    public MedicalRecord(int id, int patientId, int doctorId, Date date, String notes, String prescriptions) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.date = date;
        this.notes = notes;
        this.prescriptions = prescriptions;
    }

    // Getters and Setters
    public int getId() { return id; }
    public int getPatientId() { return patientId; }
    public int getDoctorId() { return doctorId; }
    public Date getDate() { return date; }
    public String getNotes() { return notes; }
    public String getPrescriptions() { return prescriptions; }

    public void setId(int id) { this.id = id; }
    public void setPatientId(int patientId) { this.patientId = patientId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }
    public void setDate(Date date) { this.date = date; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setPrescriptions(String prescriptions) { this.prescriptions = prescriptions; }
}