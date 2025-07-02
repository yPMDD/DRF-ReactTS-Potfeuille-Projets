package main.java.com.clinic;

import javax.swing.JOptionPane;

import main.java.com.clinic.dao.DatabaseConnection;
import main.java.com.clinic.views.LoginView;

public class Main {
    public static void main(String[] args) {
        // Start the application by showing the login view
    	
    	 if (!DatabaseConnection.testConnection()) {
    		 System.out.println("conn failed");
    	        JOptionPane.showMessageDialog(null,
    	            "Failed to connect to database. Check config.properties",
    	            "Database Error",
    	            JOptionPane.ERROR_MESSAGE);
    	        System.exit(1);
    	    }
    	
    	
        LoginView loginView = new LoginView();
        loginView.setVisible(true);
    }
}