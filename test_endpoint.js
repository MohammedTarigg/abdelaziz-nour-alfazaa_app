// Test script for Google Apps Script endpoint - HTML to PDF conversion
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Base64 encoding function for Node.js
function btoa(str) {
  // Simple base64 encoding without Buffer dependency
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  
  let byteNum;
  let chunk;
  
  for (let i = 0; i < bytes.length; i += 3) {
    byteNum = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    chunk = [
      chars[(byteNum >> 18) & 0x3F],
      chars[(byteNum >> 12) & 0x3F],
      chars[(byteNum >> 6) & 0x3F],
      chars[byteNum & 0x3F]
    ];
    output += chunk.join('');
  }
  
  return output;
}

const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbyYp9s8filgDVOOkHIZ2ehcxa-KO4XpEl6uV2zo04FMVH0m-3VfdYxljvXlccAsYQcleg/exec';

async function testEndpoint() {
  console.log('🧪 Testing Google Apps Script endpoint for HTML to PDF conversion...\n');
  
  try {
    // Test 1: GET request (should return status info)
    console.log('📡 Test 1: GET request (status check)');
    const getResponse = await fetch(ENDPOINT_URL, { method: 'GET' });
    const getData = await getResponse.text();
    console.log('Status:', getResponse.status);
    console.log('Response:', getData);
    console.log('✅ GET request successful\n');
    
    // Test 2: POST request with sample vehicle intake data (HTML format)
    console.log('📡 Test 2: POST request (HTML to PDF conversion)');
    
    // Sample vehicle intake data matching the app's structure
    const sampleIntakeData = {
      id: '1234567890',
      driverName: 'John Doe',
      driverId: 'DR001',
      customerName: 'Jane Smith',
      customerPhone: '+966-50-123-4567',
      vehiclePlate: 'ABC-123',
      vehicleColor: 'White',
      vehicleType: 'Sedan',
      damageNotes: [
        { part: 'Front Bumper', damage: 'Minor scratch on left side', timestamp: new Date().toISOString() },
        { part: 'Right Door', damage: 'Dent near handle', timestamp: new Date().toISOString() }
      ],
      generalComments: 'Vehicle in good condition overall, minor cosmetic issues noted.',
      signature: null,
      createdAt: new Date().toISOString()
    };
    
    // Generate HTML content similar to what the app generates
    const htmlContent = generateHTMLContent(sampleIntakeData);
    
    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const fileName = `intake_${sampleIntakeData.vehiclePlate}_${timestamp}.pdf`;
    
    // Send HTML content with convertToPdf flag for backend PDF conversion
    const testData = {
      fileName: fileName,
      rawHtml: htmlContent,
      convertToPdf: true,
      mimeType: 'application/pdf'
    };
    
    console.log('Sending HTML content for PDF conversion:', {
      fileName: testData.fileName,
      contentLength: htmlContent.length,
      convertToPdf: testData.convertToPdf,
      vehiclePlate: sampleIntakeData.vehiclePlate
    });
    
    const postResponse = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `fileName=${encodeURIComponent(testData.fileName)}&rawHtml=${encodeURIComponent(testData.rawHtml)}&convertToPdf=${testData.convertToPdf}&mimeType=${encodeURIComponent(testData.mimeType)}`
    });
    
    const postData = await postResponse.text();
    console.log('Status:', postResponse.status);
    console.log('Response:', postData);
    
    if (postResponse.ok) {
      console.log('✅ POST request successful');
      try {
        const jsonResponse = JSON.parse(postData);
        if (jsonResponse.success) {
          console.log('🎉 HTML to PDF conversion successful!');
          console.log('File ID:', jsonResponse.fileId);
          console.log('File URL:', jsonResponse.fileUrl);
          console.log('Folder Path:', jsonResponse.folderPath);
          console.log('File Name:', jsonResponse.name);
          console.log('MIME Type:', jsonResponse.mimeType);
        } else {
          console.log('❌ HTML to PDF conversion failed:', jsonResponse.error);
        }
      } catch (e) {
        console.log('⚠️ Response is not valid JSON:', postData);
      }
    } else {
      console.log('❌ POST request failed');
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

function generateHTMLContent(intakeData) {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vehicle Intake Report - ${intakeData.vehiclePlate}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            width: 100%; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
            color: #333;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background-color: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            font-size: 24px; 
            font-weight: bold; 
            text-align: center; 
            margin-bottom: 20px; 
            color: #cf2b24;
            border-bottom: 3px solid #cf2b24;
            padding-bottom: 10px;
          }
          .title { 
            font-size: 20px; 
            text-align: center; 
            margin-bottom: 20px; 
            color: #333;
          }
          .section { 
            margin-bottom: 20px; 
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 5px;
          }
          .section-title { 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #cf2b24;
            font-size: 18px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .label {
            font-weight: 500;
            color: #555;
            min-width: 120px;
          }
          .value {
            color: #333;
            text-align: right;
          }
          .damage-item {
            background-color: #fff3cd;
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 4px solid #ffc107;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">ALFAZAA COMPANY</div>
          <div class="title">Vehicle Intake Report</div>
          
          <div class="section">
            <div class="section-title">📋 INTAKE INFORMATION</div>
            <div class="info-row">
              <span class="label">Date & Time:</span>
              <span class="value">${new Date().toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Intake ID:</span>
              <span class="value">${intakeData.id}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">👤 DRIVER INFORMATION</div>
            <div class="info-row">
              <span class="label">Driver Name:</span>
              <span class="value">${intakeData.driverName}</span>
            </div>
            <div class="info-row">
              <span class="label">Driver ID:</span>
              <span class="value">${intakeData.driverId}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">👥 CUSTOMER INFORMATION</div>
            <div class="info-row">
              <span class="label">Customer Name:</span>
              <span class="value">${intakeData.customerName}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone Number:</span>
              <span class="value">${intakeData.customerPhone}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">🚗 VEHICLE INFORMATION</div>
            <div class="info-row">
              <span class="label">License Plate:</span>
              <span class="value">${intakeData.vehiclePlate}</span>
            </div>
            <div class="info-row">
              <span class="label">Vehicle Type:</span>
              <span class="value">${intakeData.vehicleType}</span>
            </div>
            <div class="info-row">
              <span class="label">Color:</span>
              <span class="value">${intakeData.vehicleColor}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">⚠️ DAMAGE DOCUMENTATION</div>
            ${intakeData.damageNotes
              .map(note => `
                <div class="damage-item">
                  <strong>${note.part}:</strong> ${note.damage}
                  ${note.timestamp ? `<div class="timestamp">Recorded: ${new Date(note.timestamp).toLocaleString()}</div>` : ''}
                </div>
              `)
              .join('')}
          </div>
          
          <div class="section">
            <div class="section-title">📝 GENERAL COMMENTS</div>
            <div style="padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
              ${intakeData.generalComments}
            </div>
          </div>
          
          <div class="footer">
            <p>This report was automatically generated by Alfazaa Mobile App</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Thank you for choosing Alfazaa Company</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Run the test
testEndpoint();
