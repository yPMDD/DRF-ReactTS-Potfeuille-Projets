package main.java.com.clinic.views.components;

import main.java.com.clinic.dao.MedicalRecordDAO;
import main.java.com.clinic.dao.PatientDAO;
import main.java.com.clinic.models.MedicalRecord;
import main.java.com.clinic.models.Patient;
import main.java.com.clinic.views.DoctorDashboard;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Date;

public class MedicalRecordForm extends JDialog {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private DoctorDashboard parent;
    private int patientId;
    private int doctorId;
    private JTextArea notesArea;
    private JTextArea prescriptionsArea;

    public MedicalRecordForm(DoctorDashboard parent, int patientId, int doctorId) {
        super(parent, "Add Medical Record", true);
        this.parent = parent;
        this.patientId = patientId;
        this.doctorId = doctorId;
        
        setSize(500, 400);
        setLocationRelativeTo(parent);
        
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Patient info
        PatientDAO patientDAO = new PatientDAO();
        Patient patient = patientDAO.getPatientById(patientId);
        
        JLabel patientLabel = new JLabel("Patient: " + (patient != null ? patient.getName() : "Unknown"));
        panel.add(patientLabel, BorderLayout.NORTH);
        
        // Form fields
        JPanel formPanel = new JPanel(new GridLayout(0, 1, 10, 10));
        
        formPanel.add(new JLabel("Notes:"));
        notesArea = new JTextArea(5, 20);
        notesArea.setLineWrap(true);
        notesArea.setWrapStyleWord(true);
        JScrollPane notesScroll = new JScrollPane(notesArea);
        formPanel.add(notesScroll);
        
        formPanel.add(new JLabel("Prescriptions:"));
        prescriptionsArea = new JTextArea(5, 20);
        prescriptionsArea.setLineWrap(true);
        prescriptionsArea.setWrapStyleWord(true);
        JScrollPane prescriptionsScroll = new JScrollPane(prescriptionsArea);
        formPanel.add(prescriptionsScroll);
        
        panel.add(formPanel, BorderLayout.CENTER);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        
        JButton saveButton = new JButton("Save");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveMedicalRecord();
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

    private void saveMedicalRecord() {
        String notes = notesArea.getText().trim();
        String prescriptions = prescriptionsArea.getText().trim();
        
        if (notes.isEmpty() && prescriptions.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "At least notes or prescriptions must be provided", 
                "Validation Error", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        MedicalRecord record = new MedicalRecord(
            0, 
            patientId, 
            doctorId, 
            new Date(), 
            notes, 
            prescriptions
        );
        
        MedicalRecordDAO recordDAO = new MedicalRecordDAO();
        boolean success = recordDAO.addMedicalRecord(record);
        
        if (success) {
            JOptionPane.showMessageDialog(this, 
                "Medical record added successfully", 
                "Success", 
                JOptionPane.INFORMATION_MESSAGE);
            parent.refreshRecordsTable();
            dispose();
        } else {
            JOptionPane.showMessageDialog(this, 
                "Failed to add medical record", 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}