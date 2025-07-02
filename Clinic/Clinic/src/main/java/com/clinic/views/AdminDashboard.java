package main.java.com.clinic.views;
import main.java.com.clinic.views.components.AppointmentForm;
import main.java.com.clinic.dao.DoctorDAO;
import main.java.com.clinic.dao.PatientDAO;
import main.java.com.clinic.models.Doctor;
import main.java.com.clinic.models.Patient;
import main.java.com.clinic.views.components.CalendarPanel;
import main.java.com.clinic.views.components.DoctorForm;
import main.java.com.clinic.views.components.PatientForm;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;

public class AdminDashboard extends JFrame {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private JTabbedPane tabbedPane;

    public AdminDashboard() {
        setTitle("Clinic Manager - Admin Dashboard");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        tabbedPane = new JTabbedPane();
        
        // Doctors Tab
        JPanel doctorsPanel = createDoctorsPanel();
        tabbedPane.addTab("Doctors", doctorsPanel);
        
        // Patients Tab
        JPanel patientsPanel = createPatientsPanel();
        tabbedPane.addTab("Patients", patientsPanel);
        
        // Appointments Tab
        JPanel appointmentsPanel = createAppointmentsPanel();
        tabbedPane.addTab("Appointments", appointmentsPanel);
        
        // Reports Tab
        JPanel reportsPanel = createReportsPanel();
        tabbedPane.addTab("Reports", reportsPanel);

        add(tabbedPane);
    }

    private JPanel createDoctorsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Table to display doctors
        DefaultTableModel model = new DefaultTableModel();
        model.addColumn("ID");
        model.addColumn("Name");
        model.addColumn("Specialization");
        model.addColumn("Availability");
        
        DoctorDAO doctorDAO = new DoctorDAO();
        List<Doctor> doctors = doctorDAO.getAllDoctors();
        
        for (Doctor doctor : doctors) {
            model.addRow(new Object[]{
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getAvailability()
            });
        }
        
        JTable table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Buttons panel
        JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton addButton = new JButton("Add Doctor");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Open doctor form
                DoctorForm doctorForm = new DoctorForm(AdminDashboard.this);
                doctorForm.setVisible(true);
            }
        });
        buttonsPanel.add(addButton);
        
        panel.add(buttonsPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createPatientsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Table to display patients
        DefaultTableModel model = new DefaultTableModel();
        model.addColumn("ID");
        model.addColumn("Name");
        model.addColumn("Date of Birth");
        model.addColumn("Contact Info");
        
        PatientDAO patientDAO = new PatientDAO();
        List<Patient> patients = patientDAO.getAllPatients();
        
        for (Patient patient : patients) {
            model.addRow(new Object[]{
                patient.getId(),
                patient.getName(),
                patient.getDob(),
                patient.getContactInfo()
            });
        }
        
        JTable table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        // Buttons panel
        JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton addButton = new JButton("Add Patient");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Open patient form
                PatientForm patientForm = new PatientForm(AdminDashboard.this);
                patientForm.setVisible(true);
            }
        });
        buttonsPanel.add(addButton);
        
        panel.add(buttonsPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createAppointmentsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Calendar view for appointments
        CalendarPanel calendarPanel = new CalendarPanel();
        panel.add(calendarPanel, BorderLayout.CENTER);
        
        // Buttons panel
        JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton addButton = new JButton("Add Appointment");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Open appointment form
                AppointmentForm appointmentForm = new AppointmentForm(AdminDashboard.this);
                appointmentForm.setVisible(true);
            }
        });
        buttonsPanel.add(addButton);
        
        panel.add(buttonsPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createReportsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        JLabel label = new JLabel("Reports will be displayed here");
        label.setHorizontalAlignment(SwingConstants.CENTER);
        panel.add(label, BorderLayout.CENTER);
        return panel;
    }

    public void refreshDoctorsTable() {
        JPanel doctorsPanel = (JPanel) tabbedPane.getComponentAt(0);
        Component[] components = doctorsPanel.getComponents();
        
        for (Component component : components) {
            if (component instanceof JScrollPane) {
                JScrollPane scrollPane = (JScrollPane) component;
                JViewport viewport = scrollPane.getViewport();
                JTable table = (JTable) viewport.getView();
                DefaultTableModel model = (DefaultTableModel) table.getModel();
                
                // Clear the table
                model.setRowCount(0);
                
                // Reload data
                DoctorDAO doctorDAO = new DoctorDAO();
                List<Doctor> doctors = doctorDAO.getAllDoctors();
                
                for (Doctor doctor : doctors) {
                    model.addRow(new Object[]{
                        doctor.getId(),
                        doctor.getName(),
                        doctor.getSpecialization(),
                        doctor.getAvailability()
                    });
                }
            }
        }
    }

    public void refreshPatientsTable() {
        JPanel patientsPanel = (JPanel) tabbedPane.getComponentAt(1);
        Component[] components = patientsPanel.getComponents();
        
        for (Component component : components) {
            if (component instanceof JScrollPane) {
                JScrollPane scrollPane = (JScrollPane) component;
                JViewport viewport = scrollPane.getViewport();
                JTable table = (JTable) viewport.getView();
                DefaultTableModel model = (DefaultTableModel) table.getModel();
                
                // Clear the table
                model.setRowCount(0);
                
                // Reload data
                PatientDAO patientDAO = new PatientDAO();
                List<Patient> patients = patientDAO.getAllPatients();
                
                for (Patient patient : patients) {
                    model.addRow(new Object[]{
                        patient.getId(),
                        patient.getName(),
                        patient.getDob(),
                        patient.getContactInfo()
                    });
                }
            }
        }
    }
}