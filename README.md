# Portfolio Management System

A comprehensive portfolio and project management system with report generation capabilities.

## Features Completed

### Report Generation System

- **Generate Reports**: Create Excel, CSV, and PDF reports with project and resource data
- **Download Reports**: Download generated reports directly from the interface
- **Report History**: View and manage all previously generated reports
- **Multiple Formats**: Support for Excel (.xlsx), CSV, and PDF formats
- **Data Filtering**: Select specific data types (projects, resources) for inclusion in reports

### Backend Implementation

- **Django REST API**: Complete API endpoints for report generation and management
- **File Upload/Download**: Proper handling of file uploads and downloads
- **Report Serialization**: Structured data serialization for reports
- **Media File Management**: Configured media file handling for report storage

### Frontend Implementation

- **React/TypeScript**: Modern frontend with TypeScript for type safety
- **Interactive UI**: User-friendly interface for report generation
- **Real-time Updates**: Automatic refresh of report list after generation
- **Download Functionality**: Direct file download from the browser

## API Endpoints

### Reports

- `POST /rapports/generate/` - Generate a new report
- `GET /rapports/download/<id>/` - Download a specific report
- `GET /rapports/history/` - Get all generated reports

### Request Format for Report Generation

```json
{
	"periode": "30days",
	"data_types": ["projects", "resources"],
	"format": "xlsx"
}
```

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend/portfolio
   ```

2. Install required packages:

   ```bash
   pip install -r requirements.txt
   ```

3. Run Django server:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Generate a Report**:

   - Click "Exporter Excel" button
   - Select period (7 days, 30 days, 3 months, etc.)
   - Choose data types (projects, resources)
   - Select format (Excel, CSV, PDF)
   - Click "Exporter"

2. **Download Reports**:

   - View generated reports in the table
   - Click the download icon to download any report
   - Reports are automatically saved to your downloads folder

3. **View Report History**:
   - All generated reports are listed in the table
   - Shows report name, format, period, and creation date

## Technical Details

### Report Generation Process

1. User selects options in the frontend
2. Frontend sends POST request to `/rapports/generate/`
3. Backend processes the request and generates the file
4. File is saved to the media directory
5. Report record is created in the database
6. Frontend refreshes the report list

### Supported Data Types

- **Projects**: All project information including budget, status, managers, etc.
- **Resources**: Resource inventory and usage data
- **Resources Used**: Relationship between projects and resources

### File Formats

- **Excel (.xlsx)**: Multi-sheet workbook with formatted data
- **CSV**: Simple comma-separated values with section headers
- **PDF**: Formatted document with tables and styling

## Dependencies

### Backend

- Django 5.0.2
- Django REST Framework 3.14.0
- openpyxl 3.1.2 (Excel generation)
- reportlab 4.0.7 (PDF generation)
- Pillow 10.2.0 (Image processing for PDFs)

### Frontend

- React 18
- TypeScript
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

## File Structure

```
PortfolioONEE/
├── backend/
│   ├── portfolio/
│   │   ├── portfolio/
│   │   │   ├── views.py (Report generation views)
│   │   │   ├── serializers.py (Report serializers)
│   │   │   ├── urls.py (API endpoints)
│   │   │   └── settings.py (Media file configuration)
│   │   ├── media/rapports/ (Generated report storage)
│   │   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/Rapports.tsx (Report interface)
    │   └── services/fetchData.ts (API service functions)
    └── package.json
```

## Notes

- Reports are stored in the `media/rapports/` directory
- File names include timestamp to ensure uniqueness
- All report operations require authentication
- Media files are served in development mode only
- For production, configure proper media file serving
