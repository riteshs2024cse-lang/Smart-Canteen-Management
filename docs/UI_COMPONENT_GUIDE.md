# 📸 UI Screenshots & Component Guide

## Visual Tour of the Smart Canteen Dashboard

---

## 🏠 Main Layout

### App Structure
```
┌─────────────────────────────────────────────────────┐
│  Header: Smart Canteen Management System 🌱         │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Main Content Area                │
│          │                                           │
│ ☰ Menu   │   - Dashboard                            │
│ 📊 Dash  │   - Food Logs                            │
│ 📝 Logs  │   - Predictions                          │
│ 🤖 AI    │   - Analytics                            │
│ 📈 Stats │                                           │
│          │                                           │
└──────────┴──────────────────────────────────────────┘
```

---

## 1️⃣ Dashboard Page

### Layout:
```
┌────────────────────────────────────────────┐
│  Dashboard Overview                   [🔄] │
│  Real-time canteen performance metrics     │
├────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │  🍴  │  │  👥  │  │  📉  │  │  🍃  │  │
│  │ 1250 │  │ 1050 │  │  200 │  │ 84%  │  │
│  │Prep  │  │Cons  │  │Waste │  │ Eco  │  │
│  └──────┘  └──────┘  └──────┘  └──────┘  │
├────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐  │
│  │ 📊 Weekly Trend  │ │ 📊 Food Breakdown│
│  │                  │ │                  │  │
│  │  [Area Chart]   │ │   [Bar Chart]    │  │
│  │                  │ │                  │  │
│  └─────────────────┘ └─────────────────┘  │
├────────────────────────────────────────────┤
│  Food Items Breakdown                       │
│  ┌─────┬───────┬──────┬───────┬──────┐    │
│  │ Item│ Prep  │Consum│Wasted │Status│    │
│  ├─────┼───────┼──────┼───────┼──────┤    │
│  │Rice │ 50 kg │ 42kg │ 8kg   │✅Good│    │
│  │Dal  │ 30 kg │ 28kg │ 2kg   │✅Exc │    │
│  └─────┴───────┴──────┴───────┴──────┘    │
└────────────────────────────────────────────┘
```

### Components:
- **4 Stats Cards**: Gradient icons, hover lift effect
- **2 Charts**: Area chart (trends) + Bar chart (comparison)
- **Data Table**: Sortable, color-coded waste percentages

---

## 2️⃣ Food Logs Page

### Layout:
```
┌────────────────────────────────────────────┐
│  Food Logs               [🔄 Refresh] [➕ Add]│
│  Manage daily food preparation and consumption│
├────────────────────────────────────────────┤
│  🔍 Search food items...                   │
├────────────────────────────────────────────┤
│  ┌─────┬──────┬────┬────┬─────┬─────┬───┐│
│  │Date │ Item │Prep│Cons│Waste│ %   │ ⚙ ││
│  ├─────┼──────┼────┼────┼─────┼─────┼───┤│
│  │1/15 │Rice  │ 50 │ 42 │  8  │16%  │✏🗑││
│  │1/15 │Dal   │ 30 │ 28 │  2  │ 7%  │✏🗑││
│  │1/14 │Chapati│ 45│ 40 │  5  │11%  │✏🗑││
│  └─────┴──────┴────┴────┴─────┴─────┴───┘│
└────────────────────────────────────────────┘

[When Add/Edit clicked]

┌──────────────────────────────┐
│  Add Food Log          [✕]  │
├──────────────────────────────┤
│  Food Item *                 │
│  [Rice           ]           │
│                              │
│  Date *                      │
│  [2024-01-15     ]           │
│                              │
│  Prepared Qty *  Consumed *  │
│  [50        ]    [42       ] │
│                              │
│  Wasted Qty *                │
│  [8         ]                │
│                              │
│         [Cancel] [💾 Save]   │
└──────────────────────────────┘
```

### Components:
- **Search Bar**: Icon + input with focus state
- **Action Buttons**: Edit (✏️ green) + Delete (🗑️ red)
- **Modal Form**: Slide-up animation, validation
- **Responsive Table**: Horizontal scroll on mobile

---

## 3️⃣ AI Predictions Page

### Layout:
```
┌────────────────────────────────────────────┐
│  🧠 AI Demand Predictions    [📅 Date] [🔄]│
│  Machine learning powered forecasting      │
├────────────────────────────────────────────┤
│  ✨ AI Model Active                        │
│  Predictions powered by Random Forest ML   │
│  Accuracy: 95.2%  MAE: 2.1                 │
├────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │  👥  │  │  🍴  │  │  📈  │             │
│  │ 180  │  │245kg │  │ 92%  │             │
│  │Diners│  │Recom │  │Conf  │             │
│  └──────┘  └──────┘  └──────┘             │
├────────────────────────────────────────────┤
│  Food Item Predictions                     │
│  ┌──────┬────┬────┬─────────┬─────┬────┐ │
│  │Item  │Pred│Rec │Confidence│Risk │Stat││
│  ├──────┼────┼────┼─────────┼─────┼────┤ │
│  │Rice  │45kg│48kg│███ 85% │🟢Low│✅  ││
│  │Dal   │28kg│30kg│████ 92%│🟢Low│✅  ││
│  │Chapati│40│ 42kg│██ 78%  │🟡Med│⚠️  ││
│  └──────┴────┴────┴─────────┴─────┴────┘ │
├────────────────────────────────────────────┤
│  Historical Trends (Last 7 Days)           │
│  [Line Chart: Prepared/Consumed/Wasted]   │
├────────────────────────────────────────────┤
│  ✨ AI Recommendations                     │
│  ⚠️  1 item with high waste risk          │
│  ✅  3 items showing optimal performance  │
│  📈  Based on 40 days of data (95% acc)   │
└────────────────────────────────────────────┘
```

### Components:
- **AI Banner**: Green (active) or Yellow (fallback)
- **Summary Cards**: Blue/Green/Orange gradients
- **Confidence Bars**: Animated progress bars
- **Risk Badges**: Color-coded (Green/Yellow/Red)
- **Recommendations Panel**: Icon + text insights

---

## 4️⃣ Analytics Page

### Layout:
```
┌────────────────────────────────────────────┐
│  📊 Analytics & Insights  [💾 CSV] [🔄]   │
│  Comprehensive waste analysis and trends   │
├────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │  📊  │  │  📉  │  │  🥧  │             │
│  │1250  │  │ 200  │  │16.0% │             │
│  │Prep  │  │Waste │  │ Avg  │             │
│  └──────┘  └──────┘  └──────┘             │
├────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐  │
│  │ 📊 Waste vs Cons│ │ 🥧 Distribution │  │
│  │                  │ │                  │  │
│  │  [Bar Chart]    │ │   [Pie Chart]    │  │
│  │                  │ │                  │  │
│  └─────────────────┘ └─────────────────┘  │
├────────────────────────────────────────────┤
│  📈 Weekly Trends Analysis                 │
│  [Line Chart: 3 lines (Prep/Cons/Waste)]  │
├────────────────────────────────────────────┤
│  📉 Waste Percentage Trend                 │
│  [Line Chart: Waste % over time]          │
├────────────────────────────────────────────┤
│  Detailed Waste Analysis                   │
│  ┌──────┬────┬────┬─────┬───┬─────────┐  │
│  │Item  │Prep│Cons│Waste│ % │Perform  │  │
│  ├──────┼────┼────┼─────┼───┼─────────┤  │
│  │Rice  │50kg│42kg│ 8kg │16%│████ 84%│  │
│  │Dal   │30kg│28kg│ 2kg │ 7%│████ 93%│  │
│  └──────┴────┴────┴─────┴───┴─────────┘  │
└────────────────────────────────────────────┘
```

### Components:
- **4 Chart Types**: Bar, Pie, Line (2 variations)
- **CSV Export**: Download button
- **Performance Bars**: Color gradient based on efficiency
- **Summary Cards**: Match dashboard style

---

## 🎨 Color Legend

### Status Colors:
```
🟢 Green (#10b981)  - Excellent (< 10% waste)
🟡 Yellow (#f59e0b) - Good (10-20% waste)
🔴 Red (#ef4444)    - High (> 20% waste)
🔵 Blue (#3b82f6)   - Info/Neutral
```

### Badges:
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Excellent│  │  Good   │  │High Waste│
│  (Green) │  │ (Yellow)│  │  (Red)  │
└─────────┘  └─────────┘  └─────────┘
```

### Icons in Use:
```
🍴 Utensils     - Food/Prepared
👥 Users        - Consumed/Diners
📉 TrendingDown - Waste
🍃 Leaf         - Eco Score
🧠 Brain        - AI Predictions
📊 BarChart     - Analytics
📈 TrendingUp   - Positive trends
⚠️ Alert        - Warnings
✅ CheckCircle  - Success
✨ Sparkles     - AI Features
🔄 Refresh      - Reload data
➕ Plus         - Add new
✏️ Edit         - Edit action
🗑️ Trash        - Delete action
💾 Save         - Save action
📅 Calendar     - Date picker
🔍 Search       - Search input
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+):
```
┌─────────────────────────────────┐
│ Sidebar (250px)│ Content (flex) │
└─────────────────────────────────┘
```

### Tablet (768-1199px):
```
┌─────────────────────────────────┐
│ Sidebar (200px)│ Content (flex) │
└─────────────────────────────────┘
- Charts: 2 columns → 1 column
```

### Mobile (<768px):
```
┌─────────────────┐
│  ☰  Header      │
├─────────────────┤
│   Content       │
│   (Full Width)  │
└─────────────────┘
- Sidebar: Hamburger menu
- Cards: 1 column
- Tables: Horizontal scroll
```

---

## 🎭 Interactive States

### Buttons:
```
Normal:   [  Button  ]
Hover:    [  Button  ]  (↑ lift -4px, shadow)
Active:   [  Button  ]  (darker color)
Disabled: [  Button  ]  (opacity 0.5)
```

### Cards:
```
Normal: 2px solid #e5e7eb
Hover:  2px solid #10b981 + shadow + lift
```

### Table Rows:
```
Normal: white
Hover:  #f9fafb (light gray)
```

### Form Inputs:
```
Normal: 2px solid #e5e7eb
Focus:  2px solid #10b981 + glow
Error:  2px solid #ef4444
```

---

## ⚡ Animations

### Page Load:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 0.3s
```

### Modal:
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
Duration: 0.3s
```

### Spinner:
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
Duration: 0.8s infinite
```

### Hover Lift:
```css
transform: translateY(-4px);
box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
Duration: 0.3s
```

---

## 🌐 Browser Support

Tested and works on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

---

## 📐 Grid Systems

### Stats Cards:
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 1.5rem;
```

### Charts Grid:
```css
grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
gap: 1.5rem;
```

### Mobile:
```css
grid-template-columns: 1fr;
```

---

## 🎯 Component Hierarchy

```
App
├── Header
│   └── Logo + Title
├── Sidebar
│   ├── NavLink (Dashboard)
│   ├── NavLink (Food Logs)
│   ├── NavLink (Predictions)
│   └── NavLink (Analytics)
└── Routes
    ├── Dashboard
    │   ├── StatsCard (x4)
    │   ├── AreaChart
    │   ├── BarChart
    │   └── DataTable
    ├── FoodLogs
    │   ├── SearchBar
    │   ├── DataTable
    │   └── Modal (Form)
    ├── Predictions
    │   ├── AIBanner
    │   ├── SummaryCard (x3)
    │   ├── PredictionTable
    │   ├── LineChart
    │   └── Recommendations
    └── Analytics
        ├── SummaryCard (x3)
        ├── BarChart
        ├── PieChart
        ├── LineChart (x2)
        └── DataTable
```

---

## 🔧 Customization Guide

### Change Primary Color:
```css
/* In App.css and page CSS files */
--primary: #10b981;  /* Change to your color */
```

### Adjust Card Border Radius:
```css
.card {
  border-radius: 1rem;  /* Change value */
}
```

### Modify Chart Colors:
```javascript
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', ...];
```

### Update Sidebar Width:
```css
.sidebar {
  width: 250px;  /* Adjust width */
}
```

---

**This visual guide helps you understand the complete UI structure!** 🎨

All components are responsive, accessible, and follow modern design principles! ✨
