# Expense Tracker Application

A modern, mobile-first expense tracking application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Phone-based Login**: Secure OTP-based authentication
- **Session Management**: Persistent login sessions with localStorage
- **Mobile Optimized**: Touch-friendly interface for all screen sizes

### Invoice Management
- **Add Invoices**: Upload images or take photos with OCR data extraction
- **Edit Invoices**: Click any invoice to edit details
- **Category System**: Predefined categories with custom category support (20+ characters)
- **Employee Tracking**: Associate invoices with specific employees
- **Date Management**: Automatic date handling and sorting

### Filtering & Export
- **Date Range Filtering**: Visual date picker with calendar icons
- **CSV Export**: Export filtered invoices to CSV format
- **Real-time Filtering**: Instant results based on selected criteria
- **Recent Invoices**: Quick access to latest entries

### User Experience
- **Dark Theme**: Professional dark UI throughout
- **Montserrat Font**: Clean, modern typography
- **Mobile First**: Optimized for mobile devices with responsive design
- **Touch Interactions**: Hover states, active states, and smooth transitions

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Montserrat (Google Fonts)

## 📱 Mobile Optimization

### Responsive Design
- Flexible layouts that adapt to all screen sizes
- Touch-friendly button sizes (minimum 44px touch targets)
- Optimized spacing and typography for mobile viewing

### Mobile-Specific Features
- Camera integration for invoice photo capture
- Touch gestures and interactions
- Mobile-optimized modals and dialogs
- Proper keyboard handling for form inputs

### Performance
- Optimized images with Next.js Image component
- Efficient state management with React hooks
- Local storage for data persistence
- Fast loading times with proper code splitting

## 🏗 Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Main application entry point
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard.tsx       # Main dashboard component
│   ├── login-screen.tsx    # Phone number input screen
│   ├── otp-screen.tsx      # OTP verification screen
│   ├── add-invoice-modal.tsx # Invoice creation/editing modal
│   └── date-range-picker.tsx # Date filtering component
├── public/
│   └── logo-white.png      # Application logo
└── README.md
\`\`\`

## 🎨 Design System

### Colors
- **Background**: Slate-900 (Dark blue-gray)
- **Cards**: Slate-800 (Medium blue-gray)
- **Borders**: Slate-700/600 (Light blue-gray)
- **Text**: Slate-100 (Light gray)
- **Accents**: Blue-400 for categories, Red-400 for errors

### Typography
- **Font Family**: Montserrat
- **Weights**: 
  - Regular (400) for body text
  - Medium (500) for buttons
  - Semi-bold (600) for headings

### Spacing
- **Mobile**: 3-4 spacing units (12-16px)
- **Desktop**: 4-6 spacing units (16-24px)
- **Touch Targets**: Minimum 44px for mobile interaction

## 🔧 Key Components

### Dashboard
- Central hub for all invoice management
- Three main action buttons: Date Range, Export CSV, Add Expense
- Recent invoices section with quick access
- Comprehensive invoice list with filtering

### Invoice Modal
- Multi-step process: Upload → Extract → Confirm
- Image upload with camera support
- OCR simulation for data extraction
- Form validation and error handling
- Category selection with custom options

### Date Range Picker
- Visual calendar interface
- Large, prominent calendar icons
- Mobile-optimized date inputs
- Clear and apply actions

## 📊 Data Management

### Local Storage
- Invoice data persistence
- User session management
- Automatic data migration for new features

### Data Structure
\`\`\`typescript
interface Invoice {
  id: string
  date: string
  vendorName: string
  employeeName?: string
  category?: string
  gstAmount: string | number
  totalAmount: string | number
  imageUrl?: string
  createdAt?: number
}
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
\`\`\`bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
# Create production build
npm run build

# Start production server
npm start
\`\`\`

## 🔒 Security Considerations

- Input validation on all form fields
- XSS protection with proper data sanitization
- Secure file upload handling
- Session management best practices

## 📈 Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Efficient re-rendering with React.memo where needed
- Optimized bundle size with tree shaking

## 🧪 Testing Recommendations

- Unit tests for utility functions
- Integration tests for form submissions
- Mobile device testing across different screen sizes
- Accessibility testing with screen readers

## 🔄 Future Enhancements

- Real OCR integration
- Cloud storage for invoices
- Multi-user support
- Advanced analytics and reporting
- Offline support with service workers
- Push notifications for reminders

## 📞 Support

For technical support or questions about the codebase, please refer to the component documentation and inline comments throughout the code.
\`\`\`

**Step 3: Update the main page component for better organization**
