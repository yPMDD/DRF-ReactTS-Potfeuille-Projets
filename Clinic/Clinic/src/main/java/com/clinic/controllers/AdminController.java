package main.java.com.clinic.controllers;

import main.java.com.clinic.views.AdminDashboard;

public class AdminController {
    public void showAdminDashboard() {
        AdminDashboard adminDashboard = new AdminDashboard();
        adminDashboard.setVisible(true);
    }
}