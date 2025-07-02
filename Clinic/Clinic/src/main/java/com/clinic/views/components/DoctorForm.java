package main.java.com.clinic.views.components;

import main.java.com.clinic.dao.DoctorDAO;
import main.java.com.clinic.models.Doctor;
import main.java.com.clinic.views.AdminDashboard;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class DoctorForm extends JDialog {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private AdminDashboard parent;
    private JTextField nameField;
    private JTextField specializationField;
    private JTextArea availabilityArea;

    public DoctorForm(AdminDashboard parent) {
        super(parent, "Add New Doctor", true);
        this.parent = parent;
        
        setSize(500, 400);
        setLocationRelativeTo(parent);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Form fields
        JPanel formPanel = new JPanel(new GridLayout(0, 2, 10, 10));
        
        formPanel.add(new JLabel("Name:"));
        nameField = new JTextField();
        formPanel.add(nameField);
        
        formPanel.add(new JLabel("Specialization:"));
        specializationField = new JTextField();
        formPanel.add(specializationField);
        
        formPanel.add(new JLabel("Availability:"));
        availabilityArea = new JTextArea(5, 20);
        availabilityArea.setLineWrap(true);
        availabilityArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(availabilityArea);
        formPanel.add(scrollPane);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        
        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveDoctor();
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

    private void saveDoctor() {
        String name = nameField.getText().trim();
        String specialization = specializationField.getText().trim();
        String availability = availabilityArea.getText().trim();
        
        if (name.isEmpty() || specialization.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "Name and Specialization are required fields", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        Doctor doctor = new Doctor(0, name, specialization, availability);
        DoctorDAO doctorDAO = new DoctorDAO();
        boolean success = doctorDAO.addDoctor(doctor);
        
        if (success) {
            JOptionPane.showMessageDialog(this, 
                "Doctor added successfully", 
                "Success", 
                JOptionPane.INFORMATION_MESSAGE);
            parent.refreshDoctorsTable();
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, 
                "Failed to add doctor", 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}