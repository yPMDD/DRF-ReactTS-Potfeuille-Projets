package main.java.com.clinic.views.components;

import main.java.com.clinic.dao.PatientDAO;
import main.java.com.clinic.models.Patient;
import main.java.com.clinic.views.AdminDashboard;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class PatientForm extends JDialog {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private AdminDashboard parent;
    private JTextField nameField;
    private JTextField dobField;
    private JTextField contactField;

    public PatientForm(AdminDashboard parent) {
        super(parent, "Add New Patient", true);
        this.parent = parent;
        
        setSize(400, 300);
        setLocationRelativeTo(parent);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Form fields
        JPanel formPanel = new JPanel(new GridLayout(0, 2, 10, 10));
        
        formPanel.add(new JLabel("Name:"));
        nameField = new JTextField();
        formPanel.add(nameField);
        
        formPanel.add(new JLabel("Date of Birth (YYYY-MM-DD):"));
        dobField = new JTextField();
        formPanel.add(dobField);
        
        formPanel.add(new JLabel("Contact Info:"));
        contactField = new JTextField();
        formPanel.add(contactField);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        
        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                savePatient();
            }
        });
        buttonPanel.add(saveButton);
        
        JButton cancelButton = new JButton("Cancel");
        cancelButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });
        buttonPanel.add(cancelButton);
        
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        add(panel);
    }

    private void savePatient() {
        String name = nameField.getText().trim();
        String dobStr = dobField.getText().trim();
        String contactInfo = contactField.getText().trim();
        
        if (name.isEmpty() || dobStr.isEmpty() || contactInfo.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "All fields are required", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date dob;
        
        try {
            dob = dateFormat.parse(dobStr);
        } catch (ParseException e) {
            JOptionPane.showMessageDialog(this, 
                "Invalid date format. Please use YYYY-MM-DD", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        Patient patient = new Patient(0, name, dob, contactInfo);
        PatientDAO patientDAO = new PatientDAO();
        boolean success = patientDAO.addPatient(patient);
        
        if (success) {
            JOptionPane.showMessageDialog(this, 
                "Patient added successfully", 
                "Success", 
                JOptionPane.INFORMATION_MESSAGE);
            parent.refreshPatientsTable();
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, 
                "Failed to add patient", 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}