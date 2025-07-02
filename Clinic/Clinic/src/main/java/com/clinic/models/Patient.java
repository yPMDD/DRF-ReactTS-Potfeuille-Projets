package main.java.com.clinic.models;

import java.util.Date;

public class Patient {
    private int id;
    private String name;
    private Date dob;
    private String contactInfo;

    public Patient(int id, String name, Date dob, String contactInfo) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.contactInfo = contactInfo;
    }
    @Override
    public String toString() {
        return name; // Display just the patient name
    }

    // Getters and Setters
    public int getId() { return id; }
    public String getName() { return name; }
    public Date getDob() { return dob; }
    public String getContactInfo() { return contactInfo; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDob(Date dob) { this.dob = dob; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
}