# Vehicle Intake System - Project Requirements & Context

## Project Overview
**Alfazaa Mobile App** - A React Native mobile application for vehicle intake management and documentation. The app enables drivers and staff to capture vehicle information, document damage, and generate receipts during vehicle intake processes.

## Current App Architecture

### Technology Stack
- **Framework**: React Native (with TypeScript)
- **Navigation**: React Navigation (Native Stack)
- **Database**: SQLite (react-native-quick-sqlite)
- **Printing**: Thermal printer support (react-native-esc-pos-printer)
- **Platforms**: iOS and Android

### App Structure
```
src/
├── components/
│   └── VehicleDiagram.tsx          # Interactive vehicle body diagram
├── context/
│   └── VehicleContext.tsx          # Global state management
├── screens/
│   ├── IntakeFormScreen.tsx        # Driver & customer info entry
│   ├── VehicleBodyScreen.tsx       # Damage inspection & documentation
│   └── NotesSignatureScreen.tsx    # Final review & completion
├── services/
│   ├── DatabaseService.ts          # SQLite operations
│   └── PrinterService.ts           # Thermal printing & PDF generation
└── types.ts                        # TypeScript interfaces
```

## Current Functionality

### 1. Intake Form Screen
- **Driver Information**: Name, ID
- **Customer Information**: Name, phone number
- **Vehicle Information**: License plate, color, type
- **Navigation**: Proceeds to vehicle inspection

### 2. Vehicle Body Screen
- **Interactive Diagram**: Touch-based vehicle body parts selection
- **Damage Documentation**: 
  - Damage types: Scratch, Dent, Broken, Missing, Cracked, Damaged Paint
  - Timestamped notes for each part
  - Visual damage indicators on diagram
- **Navigation**: Back to form or proceed to final review

### 3. Notes & Signature Screen
- **Damage Summary**: Review all recorded damage notes
- **General Comments**: Additional notes field
- **Final Actions**: Complete intake, save to database, print receipt
- **Navigation**: Return to start for new intake

### 4. Data Management
- **Local Storage**: SQLite database with intake_records table
- **Data Structure**: Complete intake records with metadata
- **Sync Status**: Tracks whether records have been synced (future feature)

## Current Data Model

### IntakeRecord Interface
```typescript
interface IntakeRecord {
  id: string;                    // Unique identifier
  driverName: string;           // Driver's full name
  driverId: string;             // Driver's ID number
  customerName: string;         // Customer's full name
  customerPhone: string;        // Customer's phone number
  vehiclePlate: string;         // Vehicle license plate
  vehicleColor: string;         // Vehicle color
  vehicleType: string;          // Vehicle type/category
  damageNotes: DamageNote[];    // Array of damage documentation
  generalComments: string;      // Additional notes
  signature: string | null;     // Customer signature (currently disabled)
  createdAt: string;            // Timestamp
  synced?: boolean;             // Sync status flag
}
```

### DamageNote Interface
```typescript
interface DamageNote {
  part: string;                 // Vehicle body part
  damage: string;               // Type of damage
  timestamp?: string;           // When damage was recorded
}
```

## New Requirement: Google Drive PDF Integration

### Primary Goal
Automatically save a PDF version of each completed intake form to Google Drive for:
- **Backup & Archival**: Secure cloud storage of all intake records
- **Accessibility**: Access intake records from any device
- **Compliance**: Digital record keeping for business requirements
- **Sharing**: Ability to share intake records with stakeholders

### PDF Content Requirements
Each PDF should contain:
1. **Company Header**: Alfazaa Company branding
2. **Intake Metadata**: Date/time, intake ID
3. **Driver Information**: Name, ID
4. **Customer Information**: Name, phone
5. **Vehicle Information**: Plate, type, color
6. **Damage Documentation**: All recorded damage notes with timestamps
7. **General Comments**: Additional notes
8. **Signature Section**: Customer signature (when implemented)
9. **Footer**: Company information and thank you message

### Technical Requirements
- **Automatic Generation**: PDF created automatically upon intake completion
- **Cloud Storage**: Direct upload to Google Drive
- **File Organization**: Structured folder hierarchy in Drive
- **Naming Convention**: Descriptive filenames with timestamps
- **Error Handling**: Graceful fallback if upload fails
- **Offline Support**: Queue uploads when offline

## Implementation Options Analysis

### Option 1: Google Drive API with `drive.file` Scope (Recommended for Production)
**Pros:**
- Direct integration with Google Drive
- Full control over file organization and metadata
- Professional implementation
- Automatic sync and backup
- Can implement folder structures and search
- Uses non-sensitive scope (avoids restricted app verification)

**Cons:**
- Requires Google Cloud Console setup
- OAuth authentication flow
- More complex implementation
- API quotas and rate limits

**Best For:** Production apps, professional deployment

### Option 2: Server/BFF with Service Account (Enterprise Recommended)
**Pros:**
- Rock-solid control over file placement
- No on-device secrets or OAuth prompts
- Centralized auth and quota management
- Domain-wide delegation for company Drive
- Professional, scalable solution

**Cons:**
- Requires backend server infrastructure
- More complex architecture
- Service account management

**Best For:** Enterprise deployments, company-wide Drive integration

### Option 3: Google Drive App Integration
**Pros:**
- Simpler implementation
- Uses device's Google Drive app
- No API keys or OAuth setup
- Familiar user experience

**Cons:**
- User must have Google Drive app installed
- Less control over file organization
- Manual folder management

**Best For:** Quick implementation, MVP

### Option 4: Apps Script Web App Endpoint
**Pros:**
- Super simple implementation
- No backend infrastructure needed
- Direct Drive integration
- Company Drive organization

**Cons:**
- Limited to single company Drive
- Less control over file metadata
- Google Apps Script limitations

**Best For:** Simple company workflows, no backend

### Option 5: Zapier/Make Webhook Integration
**Pros:**
- Zero backend development
- Quick to implement
- Reliable automation
- Professional workflow tools

**Cons:**
- Monthly subscription costs
- Limited customization
- External service dependency

**Best For:** Rapid prototyping, no development resources

### Option 6: OS-Level Share & Document Pickers
**Pros:**
- Minimal code required
- Native OS integration
- No authentication setup
- Works with any cloud service

**Cons:**
- User-driven (not automatic)
- Requires user interaction
- Less control over organization

**Best For:** MVP, user-controlled file placement

### Option 7: Email to Google Drive
**Pros:**
- Very simple implementation
- Uses existing email infrastructure
- Can set up auto-forwarding rules
- No additional dependencies

**Cons:**
- Requires email setup
- Less automated
- Files go to email first, then Drive

**Best For:** Simple workflows, email-based processes

### Option 8: Local Storage + Manual Upload
**Pros:**
- Simplest to implement
- No external dependencies
- Works completely offline
- No authentication required

**Cons:**
- Requires manual file management
- No automatic backup
- User must remember to upload

**Best For:** Development/testing, offline-first requirements

## Recommended Implementation Path

### Phase 1: PDF Generation
1. Install PDF generation library (react-native-html-to-pdf)
2. Create HTML template for intake forms
3. Implement PDF generation in PrinterService
4. Test PDF output and formatting

### Phase 2: Google Drive Integration
1. **Option 6** (OS-Level Share & Document Pickers) for fastest MVP
2. Test file saving and organization
3. Implement error handling and fallbacks

### Phase 3: Enhanced Features
1. **Option 1** (Google Drive API with `drive.file` scope) for production
2. Implement folder organization
3. Add search and metadata capabilities
4. Implement offline queue system

## Technical Implementation Notes

### Critical Implementation Considerations
- **Prefer `drive.file` scope** over broad `drive` scope to avoid heavy verification and CASA requirements
- **Use resumable uploads** for reliability on mobile; keep session URL and chunk with `Content-Range`
- **Avoid deprecated APIs**: The Drive Android API in Google Play services is deprecated - stick to REST
- **Consider `appDataFolder`** for hidden backups (private app-only storage in Drive)

### Authentication & Scopes
- **`drive.file`**: Non-sensitive scope, creates files in app-created folders
- **`drive.appdata`**: App-only storage, completely private
- **`drive`**: Full access (restricted, requires verification)

### Upload Strategies
- **Multipart uploads**: Good for small files (< 5MB)
- **Resumable uploads**: Essential for mobile reliability, handles network interruptions
- **Chunked uploads**: For large files, better error recovery

### Error Handling & Reliability
- **Network connectivity issues**: Implement retry logic with exponential backoff
- **Authentication failures**: Graceful fallback to local storage
- **Upload failures**: Queue failed uploads for retry
- **Storage limits**: Check available space before upload

## Technical Considerations

### File Naming Convention
```
intake_[PLATE]_[DATE]_[TIME].pdf
Example: intake_ABC123_2024-01-15_14-30-22.pdf
```

### Folder Structure
```
Google Drive/
└── Alfazaa Intakes/
    ├── 2024/
    │   ├── January/
    │   ├── February/
    │   └── ...
    └── Archive/
```

### Error Handling
- Network connectivity issues
- Google Drive storage limits
- Authentication failures
- PDF generation errors
- Offline scenarios

### Performance Considerations
- PDF generation time
- File upload size
- Background processing
- Memory management

## Success Criteria
1. **Reliability**: 99%+ successful PDF generation and upload
2. **Performance**: PDF generation < 5 seconds, upload < 30 seconds
3. **User Experience**: Seamless integration with existing workflow
4. **Data Integrity**: Complete preservation of all intake information
5. **Accessibility**: Easy retrieval and sharing of stored PDFs

## Next Steps
1. Choose implementation approach (recommend starting with Option 6 for MVP)
2. Install required dependencies
3. Implement PDF generation
4. Test Google Drive integration
5. Refine user experience and error handling
6. Deploy and monitor performance

## Specific Recommendations for Your App

### For MVP (Fastest to Market)
**Choose Option 6: OS-Level Share & Document Pickers**
- Implement PDF generation first
- Add native share functionality to let users save to Drive
- No authentication setup required
- Users can organize files in their own Drive structure
- Can ship in 1-2 weeks

### For Production (Automated & Professional)
**Choose Option 1: Google Drive API with `drive.file` scope**
- Implement resumable uploads for reliability
- Use `drive.file` scope to avoid verification requirements
- Create organized folder structure automatically
- Background upload queue for offline scenarios
- Professional, automated solution

### For Enterprise (Company-Wide Control)
**Choose Option 2: Server with Service Account**
- Backend handles all Drive operations
- Domain-wide delegation for company Drive
- Centralized file organization
- No device-level authentication
- Best for multi-user, company-managed scenarios

### Decision Factors
- **Timeline**: MVP (2 weeks) vs Production (6-8 weeks)
- **Control**: User-managed vs Company-managed
- **Infrastructure**: Client-only vs Backend required
- **Budget**: Free vs Service costs vs Development costs
