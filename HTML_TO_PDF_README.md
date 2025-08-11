# HTML to PDF Conversion - Alfazaa Mobile App

## Overview

The Alfazaa Mobile App now includes HTML to PDF conversion functionality that automatically generates professional vehicle intake reports and saves them to Google Drive. This feature uses a Google Apps Script endpoint to convert HTML content to PDF format.

## How It Works

### 1. HTML Generation
- The app generates professional HTML content for vehicle intake reports
- HTML includes comprehensive styling for a professional appearance
- Content includes all vehicle, driver, customer, and damage information

### 2. PDF Conversion Process
- HTML content is converted to base64 format for transmission
- Data is sent to Google Apps Script endpoint via POST request
- Google Apps Script converts HTML to PDF and saves to Google Drive
- Returns file ID, URL, and folder path information

### 3. File Organization
- Files are automatically organized by date (YYYY/MM format)
- Naming convention: `intake_[PLATE]_[TIMESTAMP].html`
- Example: `intake_ABC-123_2025-08-11T03-00-02.html`

## Technical Implementation

### PrinterService.ts
- `convertHtmlToPdfAndSave()` - Main method for HTML to PDF conversion
- `generateHTMLContent()` - Generates professional HTML report
- `convertToBase64()` - Converts HTML to base64 for transmission
- `handleGoogleDriveResponse()` - Processes endpoint responses

### Endpoint Integration
- **URL**: `https://script.google.com/macros/s/AKfycbyYp9s8filgDVOOkHIZ2ehcxa-KO4XpEl6uV2zo04FMVH0m-3VfdYxljvXlccAsYQcleg/exec`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Parameters**:
  - `fileName`: The name of the file to create
  - `fileData`: Base64-encoded HTML content
  - `mimeType`: Content type (text/html)

### Response Format
```json
{
  "success": true,
  "fileId": "1ljDZjytvGZY3aZUUlNEcdyFHI-4JPBpb",
  "fileUrl": "https://drive.google.com/file/d/1ljDZjytvGZY3aZUUlNEcdyFHI-4JPBpb/view?usp=drivesdk",
  "folderPath": "2025/08",
  "name": "intake_ABC-123_2025-08-11T03-00-02.html",
  "mimeType": "text/html"
}
```

## User Experience

### Success Flow
1. User completes vehicle intake form
2. App generates HTML report
3. HTML is converted to PDF via Google Apps Script
4. PDF is saved to Google Drive
5. User receives confirmation with file details

### Error Handling
- Network connectivity issues
- Invalid response formats
- Server-side conversion errors
- Graceful fallback with user feedback

## Testing

### Test Script
- `test_endpoint.js` - Comprehensive endpoint testing
- Tests both GET and POST requests
- Uses sample vehicle intake data
- Validates response format and success

### Test Command
```bash
node test_endpoint.js
```

## Benefits

1. **Professional Reports**: Beautiful, formatted PDF reports
2. **Automatic Organization**: Files organized by date automatically
3. **Cloud Storage**: Secure Google Drive storage
4. **Easy Access**: Direct links to generated reports
5. **Offline Capability**: Works even with intermittent connectivity
6. **Scalable**: Google Apps Script handles conversion server-side

## Future Enhancements

- PDF customization options
- Email integration for report delivery
- Multiple report templates
- Batch processing capabilities
- Advanced styling options

## Troubleshooting

### Common Issues
1. **Network Errors**: Check internet connectivity
2. **Invalid Responses**: Verify endpoint URL and parameters
3. **Base64 Encoding**: Ensure proper character encoding
4. **File Size**: Large HTML content may cause timeouts

### Debug Information
- Check console logs for detailed error messages
- Verify endpoint response status and content
- Test with simple HTML content first
- Use test script to validate endpoint functionality
