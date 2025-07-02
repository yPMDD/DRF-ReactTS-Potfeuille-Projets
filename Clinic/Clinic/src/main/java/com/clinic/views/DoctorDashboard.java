package main.java.com.clinic.views;

import main.java.com.clinic.dao.AppointmentDAO;
import main.java.com.clinic.dao.DoctorDAO;
import main.java.com.clinic.dao.MedicalRecordDAO;
import main.java.com.clinic.dao.PatientDAO;
import main.java.com.clinic.models.Appointment;
import main.java.com.clinic.models.MedicalRecord;
import main.java.com.clinic.models.Patient;
import main.java.com.clinic.views.components.MedicalRecordForm;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;

public class DoctorDashboard extends JFrame {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int doctorId;
    private JTabbedPane tabbedPane;

    public DoctorDashboard(int doctorId) {
        this.doctorId = doctorId;
        
        setTitle("Clinic Manager - Doctor Dashboard");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        tabbedPane = new JTabbedPane();
        
        // Today's Appointments Tab
        JPanel appointmentsPanel = createAppointmentsPanel();
        tabbedPane.addTab("Today's Appointments", appointmentsPanel);
        
        // Patient Records Tab
        JPanel recordsPanel = createRecordsPanel();
        tabbedPane.addTab("Patient Records", recordsPanel);
        
        // Availability Tab
        JPanel availabilityPanel = createAvailabilityPanel();
        tabbedPane.addTab("My Availability", availabilityPanel);

        add(tabbedPane);
    }

    private JPanel createAppointmentsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Table to display today's appointments
        DefaultTableModel model = new DefaultTableModel();
        model.addColumn("ID");
        model.addColumn("Patient Name");
        model.addColumn("Date & Time");
        model.addColumn("Status");
        
        AppointmentDAO appointmentDAO = new AppointmentDAO();
        List<Appointment> appointments = appointmentDAO.getAppointmentsByDoctor(doctorId);
        
        PatientDAO patientDAO = new PatientDAO();
        
        for (Appointment appointment : appointments) {
            Patient patient = patientDAO.getPatientById(appointment.getPatientId());
            model.addRow(new Object[]{
                appointment.getId(),
                patient != null ? patient.getName() : "Unknown",
                appointment.getDatetime(),
                appointment.getStatus()
            });
        }
        
        JTable table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Buttons panel
        JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton addRecordButton = new JButton("Add Medical Record");
        addRecordButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int selectedRow = table.getSelectedRow();
                if (selectedRow >= 0) {
                    int appointmentId = (int) table.getValueAt(selectedRow, 0);
                    int patientId = appointmentDAO.getPatientIdByAppointmentId(appointmentId);
                    
                    // Open medical record form
                    MedicalRecordForm recordForm = new MedicalRecordForm(DoctorDashboard.this, patientId, doctorId);
                    recordForm.setVisible(true);
                } else {
                    JOptionPane.showMessageDialog(DoctorDashboard.this, 
                        "Please select an appointment first", 
                        "No Selection", 
                        JOptionPane.WARNING_MESSAGE);
                }
            }
        });
        buttonsPanel.add(addRecordButton);
        
        panel.add(buttonsPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createRecordsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Table to display patient records
        DefaultTableModel model = new DefaultTableModel();
        model.addColumn("ID");
        model.addColumn("Patient Name");
        model.addColumn("Date");
        model.addColumn("Notes");
        model.addColumn("Prescriptions");
        
        MedicalRecordDAO recordDAO = new MedicalRecordDAO();
        List<MedicalRecord> records = recordDAO.getRecordsByDoctor(doctorId);
        
        PatientDAO patientDAO = new PatientDAO();
        
        for (MedicalRecord record : records) {
            Patient patient = patientDAO.getPatientById(record.getPatientId());
            model.addRow(new Object[]{
                record.getId(),
                patient != null ? patient.getName() : "Unknown",
                record.getDate(),
                record.getNotes(),
                record.getPrescriptions()
            });
        }
        
        JTable table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }

    private JPanel createAvailabilityPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        JTextArea availabilityArea = new JTextArea();
        availabilityArea.setLineWrap(true);
        availabilityArea.setWrapStyleWord(true);
        
        // Load current availability
        DoctorDAO doctorDAO = new DoctorDAO();
        String availability = doctorDAO.getDoctorAvailability(doctorId);
        availabilityArea.setText(availability != null ? availability : "");
        
        JScrollPane scrollPane = new JScrollPane(availabilityArea);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Save button
        JButton saveButton = new JButton("Save Availability");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String newAvailability = availabilityArea.getText();
                boolean success = doctorDAO.updateDoctorAvailability(doctorId, newAvailability);
                
                if (success) {
                    JOptionPane.showMessageDialog(DoctorDashboard.this, 
                        "Availability updated successfully", 
                        "Success", 
                        JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(DoctorDashboard.this, 
                        "Failed to update availability", 
                        "Error", 
                        JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttonPanel.add(saveButton);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    public void refreshAppointmentsTable() {
        JPanel appointmentsPanel = (JPanel) tabbedPane.getComponentAt(0);
        Component[] components = appointmentsPanel.getComponents();
        
        for (Component component : components) {
            if (component instanceof JScrollPane) {
                JScrollPane scrollPane = (JScrollPane) component;
                JViewport viewport = scrollPane.getViewport();
                JTable table = (JTable) viewport.getView();
                DefaultTableModel model = (DefaultTableModel) table.getModel();
                
                // Clear the table
                model.setRowCount(0);
                
                // Reload data
                AppointmentDAO appointmentDAO = new AppointmentDAO();
                List<Appointment> appointments = appointmentDAO.getAppointmentsByDoctor(doctorId);
                
                PatientDAO patientDAO = new PatientDAO();
                
                for (Appointment appointment : appointments) {
                    Patient patient = patientDAO.getPatientById(appointment.getPatientId());
                    model.addRow(new Object[]{
                        appointment.getId(),
                        patient != null ? patient.getName() : "Unknown",
                        appointment.getDatetime(),
                        appointment.getStatus()
                    });
                }
            }
        }
    }

    public void refreshRecordsTable() {
        JPanel recordsPanel = (JPanel) tabbedPane.getComponentAt(1);
        Component[] components = recordsPanel.getComponents();
        
        for (Component component : components) {
            if (component instanceof JScrollPane) {
                JScrollPane scrollPane = (JScrollPane) component;
                JViewport viewport = scrollPane.getViewport();
                JTable table = (JTable) viewport.getView();
                DefaultTableModel model = (DefaultTableModel) table.getModel();
                
                // Clear the table
                model.setRowCount(0);
                
                // Reload data
                MedicalRecordDAO recordDAO = new MedicalRecordDAO();
                List<MedicalRecord> records = recordDAO.getRecordsByDoctor(doctorId);
                
                PatientDAO patientDAO = new PatientDAO();
                
                for (MedicalRecord record : records) {
                    Patient patient = patientDAO.getPatientById(record.getPatientId());
                    model.addRow(new Object[]{
                        record.getId(),
                        patient != null ? patient.getName() : "Unknown",
                        record.getDate(),
                        record.getNotes(),
                        record.getPrescriptions()
                    });
                }
            }
        }
    }
}