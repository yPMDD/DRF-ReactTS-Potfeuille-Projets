package main.java.com.clinic.views.components;

import main.java.com.clinic.dao.AppointmentDAO;
import main.java.com.clinic.dao.DoctorDAO;
import main.java.com.clinic.dao.PatientDAO;
import main.java.com.clinic.models.Appointment;
import main.java.com.clinic.models.Doctor;
import main.java.com.clinic.models.Patient;
import main.java.com.clinic.views.AdminDashboard;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class AppointmentForm extends JDialog {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private AdminDashboard parent;
    private JComboBox<Patient> patientCombo;
    private JComboBox<Doctor> doctorCombo;
    private JTextField datetimeField;

    public AppointmentForm(AdminDashboard parent) {
        super(parent, "Add New Appointment", true);
        this.parent = parent;
        
        setSize(400, 300);
        setLocationRelativeTo(parent);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Form fields
        JPanel formPanel = new JPanel(new GridLayout(0, 2, 10, 10));
        
        formPanel.add(new JLabel("Patient:"));
        patientCombo = new JComboBox<>();
        loadPatients();
        formPanel.add(patientCombo);
        
        formPanel.add(new JLabel("Doctor:"));
        doctorCombo = new JComboBox<>();
        loadDoctors();
        formPanel.add(doctorCombo);
        
        formPanel.add(new JLabel("Date & Time (YYYY-MM-DD HH:MM):"));
        datetimeField = new JTextField();
        formPanel.add(datetimeField);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        
        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveAppointment();
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

    private void loadPatients() {
        PatientDAO patientDAO = new PatientDAO();
        List<Patient> patients = patientDAO.getAllPatients();
        
        for (Patient patient : patients) {
            patientCombo.addItem(patient);
        }
    }

    private void loadDoctors() {
        DoctorDAO doctorDAO = new DoctorDAO();
        List<Doctor> doctors = doctorDAO.getAllDoctors();
        
        for (Doctor doctor : doctors) {
            doctorCombo.addItem(doctor);
        }
    }

    private void saveAppointment() {
        Patient selectedPatient = (Patient) patientCombo.getSelectedItem();
        Doctor selectedDoctor = (Doctor) doctorCombo.getSelectedItem();
        String datetimeStr = datetimeField.getText().trim();
        
        if (selectedPatient == null || selectedDoctor == null || datetimeStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "All fields are required", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date datetime;
        
        try {
            datetime = dateFormat.parse(datetimeStr);
        } catch (ParseException e) {
            JOptionPane.showMessageDialog(this, 
                "Invalid date/time format. Please use YYYY-MM-DD HH:MM", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        Appointment appointment = new Appointment(
            0, 
            selectedPatient.getId(), 
            selectedDoctor.getId(), 
            datetime, 
            "SCHEDULED"
        );
        
        AppointmentDAO appointmentDAO = new AppointmentDAO();
        boolean success = appointmentDAO.addAppointment(appointment);
        
        if (success) {
            JOptionPane.showMessageDialog(this, 
                "Appointment added successfully", 
                "Success", 
                JOptionPane.INFORMATION_MESSAGE);
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, 
                "Failed to add appointment", 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}