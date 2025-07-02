package main.java.com.clinic.views;

import main.java.com.clinic.auth.Authentication;
import main.java.com.clinic.auth.User;
import main.java.com.clinic.controllers.AdminController;
import main.java.com.clinic.controllers.DoctorController;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class LoginView extends JFrame {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private JTextField usernameField;
    private JPasswordField passwordField;

    public LoginView() {
        setTitle("Clinic Manager - Login");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        JLabel titleLabel = new JLabel("Clinic Manager Login");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 18));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        panel.add(titleLabel, gbc);

        gbc.gridwidth = 1;
        gbc.gridy = 1;
        gbc.gridx = 0;
        panel.add(new JLabel("Username:"), gbc);

        gbc.gridx = 1;
        usernameField = new JTextField(15);
        panel.add(usernameField, gbc);

        gbc.gridy = 2;
        gbc.gridx = 0;
        panel.add(new JLabel("Password:"), gbc);

        gbc.gridx = 1;
        passwordField = new JPasswordField(15);
        panel.add(passwordField, gbc);

        gbc.gridy = 3;
        gbc.gridx = 0;
        gbc.gridwidth = 2;
        JButton loginButton = new JButton("Login");
        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String username = usernameField.getText();
                String password = new String(passwordField.getPassword());

                User user = Authentication.authenticate(username, password);
                if (user != null) {
                    dispose(); // Close login window
                    
                    if (user.getRole().equals("ADMIN")) {
                        AdminController adminController = new AdminController();
                        adminController.showAdminDashboard();
                    } else if (user.getRole().equals("DOCTOR")) {
                        DoctorController doctorController = new DoctorController(user.getId());
                        doctorController.showDoctorDashboard();
                    }
                } else {
                    JOptionPane.showMessageDialog(LoginView.this, 
                        "Invalid username or password", 
                        "Login Error", 
                        JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        panel.add(loginButton, gbc);

        add(panel);
    }
}