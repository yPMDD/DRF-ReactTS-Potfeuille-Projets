package main.java.com.clinic.views.components;

import main.java.com.clinic.dao.AppointmentDAO;
import main.java.com.clinic.models.Appointment;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class CalendarPanel extends JPanel {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private JTable calendarTable;
    private DefaultTableModel model;
    private JComboBox<Integer> yearCombo;
    private JComboBox<String> monthCombo;
    private int currentYear;
    private int currentMonth;

    public CalendarPanel() {
        setLayout(new BorderLayout());
        
        // Get current date
        Calendar calendar = Calendar.getInstance();
        currentYear = calendar.get(Calendar.YEAR);
        currentMonth = calendar.get(Calendar.MONTH);
        
        // Create controls panel
        JPanel controlsPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        
        // Year combo
        yearCombo = new JComboBox<>();
        for (int year = currentYear - 5; year <= currentYear + 5; year++) {
            yearCombo.addItem(year);
        }
        yearCombo.setSelectedItem(currentYear);
        yearCombo.addActionListener(e -> updateCalendar());
        controlsPanel.add(yearCombo);
        
        // Month combo
        monthCombo = new JComboBox<>(new String[]{
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        });
        monthCombo.setSelectedIndex(currentMonth);
        monthCombo.addActionListener(e -> updateCalendar());
        controlsPanel.add(monthCombo);
        
        add(controlsPanel, BorderLayout.NORTH);
        
        // Create calendar table
        model = new DefaultTableModel() {
            /**
			 * 
			 */
			private static final long serialVersionUID = 1L;

			@Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        
        model.setColumnIdentifiers(new String[]{"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"});
        
        calendarTable = new JTable(model);
        calendarTable.setRowHeight(60);
        calendarTable.setShowGrid(true);
        calendarTable.setGridColor(Color.LIGHT_GRAY);
        
        add(new JScrollPane(calendarTable), BorderLayout.CENTER);
        
        // Initial calendar update
        updateCalendar();
    }

    private void updateCalendar() {
        int year = (int) yearCombo.getSelectedItem();
        int month = monthCombo.getSelectedIndex();
        
        // Clear the table
        model.setRowCount(0);
        
        // Set up calendar
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month, 1);
        
        int firstDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        int daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        
        // Calculate weeks needed
        int weeks = (int) Math.ceil((firstDayOfWeek + daysInMonth - 1) / 7.0);
        model.setRowCount(weeks);
        
        // Fill the calendar
        int day = 1;
        for (int i = 0; i < weeks; i++) {
            for (int j = 0; j < 7; j++) {
                if ((i == 0 && j < firstDayOfWeek - 1) || day > daysInMonth) {
                    model.setValueAt("", i, j);
                } else {
                    // Check for appointments on this day
                    calendar.set(year, month, day);
                    Date date = calendar.getTime();
                    
                    AppointmentDAO appointmentDAO = new AppointmentDAO();
                    List<Appointment> appointments = appointmentDAO.getAppointmentsByDate(date);
                    
                    String cellText = day + (appointments.isEmpty() ? "" : " (" + appointments.size() + " appts)");
                    model.setValueAt(cellText, i, j);
                    day++;
                }
            }
        }
    }
}