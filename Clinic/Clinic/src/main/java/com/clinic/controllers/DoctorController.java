package main.java.com.clinic.controllers;

import main.java.com.clinic.views.DoctorDashboard;

public class DoctorController {
    private int doctorId;
    
    public DoctorController(int doctorId) {
        this.doctorId = doctorId;
    }
    
    public void showDoctorDashboard() {
        DoctorDashboard doctorDashboard = new DoctorDashboard(doctorId);
        doctorDashboard.setVisible(true);
    }
}