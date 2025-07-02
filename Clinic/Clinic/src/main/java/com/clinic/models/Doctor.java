package main.java.com.clinic.models;

public class Doctor {
    private int id;
    private String name;
    private String specialization;
    private String availability;

    public Doctor(int id, String name, String specialization, String availability) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.availability = availability;
    }
    @Override
    public String toString() {
        return name + " (" + specialization + ")"; // Example: "Dr. Smith (Cardiology)"
    }
    // Getters and Setters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getSpecialization() { return specialization; }
    public String getAvailability() { return availability; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public void setAvailability(String availability) { this.availability = availability; }
}