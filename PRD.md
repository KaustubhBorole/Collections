# Planning Guide

A sophisticated, production-ready data grid component (Nova Grid) that provides enterprise-level features including global search, column-based filtering, multi-column sorting, row selection, pagination, and dynamic column visibility in a clean, modern interface.

**Experience Qualities**:
1. **Powerful** - Extensive filtering, sorting, and data manipulation capabilities that handle complex datasets with ease
2. **Intuitive** - Smart popovers, clear visual feedback, and familiar spreadsheet-like interactions that require minimal learning
3. **Responsive** - Smooth interactions, debounced inputs, and adaptive layouts that feel instantaneous and professional

**Complexity Level**: Light Application (multiple features with basic state)
The grid is a self-contained component with rich interactivity but manageable state - filters, sorting, selection, and pagination all operate on client-side data without backend complexity.

## Essential Features

**Global Search**
- Functionality: Real-time search across all columns simultaneously
- Purpose: Quick data discovery without column-specific knowledge
- Trigger: User types in the search input field
- Progression: Type query → 250ms debounce → filter rows → update display → maintain pagination
- Success criteria: Results update smoothly, irrelevant rows disappear, search term highlights conceptually through filtering

**Column Filtering**
- Functionality: Text-based and value-based filtering per column with type awareness (string/number/date/boolean)
- Purpose: Precise data narrowing for analytical work
- Trigger: User enters text in column filter input or clicks funnel icon for value picker
- Progression: Click funnel → popover opens → select values → Apply → rows filter → popover closes
- Success criteria: Filter state persists visually (blue ring on funnel), multiple filters combine with AND logic, cleared filters reset immediately

**Multi-Column Sorting**
- Functionality: Click column headers to sort ascending/descending/none with visual indicators
- Purpose: Organize data by different criteria for analysis
- Trigger: Click sortable column header
- Progression: Click header → cycle sort (none → asc → desc → none) → arrow icon updates → rows reorder
- Success criteria: Sort direction clearly indicated, data orders correctly by type, sorting persists through filtering

**Row Selection**
- Functionality: Individual checkboxes plus select-all for visible rows with indeterminate state
- Purpose: Enable batch operations on selected data
- Trigger: Click checkbox or select-all header checkbox
- Progression: Click row checkbox → selection state updates → callback fires → count updates
- Success criteria: Checkboxes reflect state, indeterminate shows partial selection, selection survives pagination

**Pagination**
- Functionality: Fixed 10 rows per page with First/Prev/Next/Last navigation
- Purpose: Manage large datasets without overwhelming UI
- Trigger: Click pagination buttons
- Progression: Click Next → page increments → new rows load → empty rows pad to 10 → page indicator updates
- Success criteria: Always shows 10 row slots (with padding), page resets on filter changes, buttons disable at boundaries

**Column Visibility**
- Functionality: Show/hide columns dynamically via popover menu
- Purpose: Focus on relevant data, reduce visual clutter
- Trigger: Click columns icon in toolbar
- Progression: Click icon → popover opens → toggle checkboxes → Apply → grid reflows → popover closes
- Success criteria: Hidden columns disappear from table, visibility persists, Show All restores everything

**Toolbar Actions**
- Functionality: Icon buttons for Clear/Add/Remove/View/Download/Refresh/Columns
- Purpose: Quick access to common grid operations
- Trigger: Click toolbar icon button
- Progression: Hover button → tooltip shows → click → action executes
- Success criteria: Icons are recognizable, hover states provide feedback, Clear resets all filters/search/sort

**Smart Popovers**
- Functionality: Auto-positioning dropdowns that flip left/right and prevent viewport overflow
- Purpose: Ensure UI controls never get cut off or positioned awkwardly
- Trigger: Open filter or column visibility menu
- Progression: Click trigger → calculate space → position popover → bind ResizeObserver → reposition on scroll/resize → close on outside click
- Success criteria: Popovers always fully visible, resize handles work, responsive to viewport changes

## Edge Case Handling

- **Empty Results**: "No rows match your filters" message shown when all rows filtered out
- **No Data**: Single empty row shown to maintain 10-row structure
- **Undefined Props**: Safe fallbacks for undefined columns/data arrays prevent crashes
- **Page Overflow**: Auto-reset to valid page when filters reduce result count
- **Rapid Typing**: 250ms debounce on search prevents excessive re-renders
- **Viewport Edges**: Popover repositioning prevents cutoff on small screens or scrolled views
- **All Deselected**: Checkbox shows unchecked state, not indeterminate

## Design Direction

The design should feel professional, data-focused, and highly functional - like a sophisticated spreadsheet or enterprise dashboard. Minimal decoration with emphasis on clarity, hierarchy, and responsive feedback. A clean, corporate aesthetic with subtle interactions that communicate power without complexity.

## Color Selection

Triadic color scheme with blue primary for actions, neutral grays for structure, and accent colors for status indicators.

- **Primary Color**: Deep Blue `oklch(0.45 0.15 250)` - Communicates trust, professionalism, and actionable elements (Apply buttons, active filters)
- **Secondary Colors**: 
  - Neutral Gray `oklch(0.95 0 0)` for table headers and subtle backgrounds
  - Mid Gray `oklch(0.55 0 0)` for disabled states and muted text
- **Accent Color**: Success Green `oklch(0.55 0.15 145)` for active/true status badges
- **Foreground/Background Pairings**:
  - Background (White `oklch(1 0 0)`): Dark text `oklch(0.145 0 0)` - Ratio 21:1 ✓
  - Card/Header (Light Gray `oklch(0.97 0 0)`): Dark text `oklch(0.145 0 0)` - Ratio 19:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Hover States (Black/5% `rgba(0,0,0,0.05)`): Dark text `oklch(0.145 0 0)` - Ratio 18:1 ✓
  - Muted (Light Gray `oklch(0.97 0 0)`): Muted text `oklch(0.556 0 0)` - Ratio 4.8:1 ✓

## Font Selection

Clean, technical typefaces that emphasize legibility and data clarity - Inter for its excellent number rendering and neutral personality, perfect for dense tabular content.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold/24px/tight (1.2em) letter spacing
  - Body (Table Cells): Inter Regular/14px/normal (1em) letter spacing, 1.5 line-height
  - Small (Filters/Buttons): Inter Regular/12px/normal letter spacing
  - Labels (Column Headers): Inter SemiBold/14px/normal letter spacing

## Animations

Subtle, functional animations that provide feedback without distraction - hover states that confirm interactivity, smooth transitions on sort direction changes, and gentle fade-ins for popovers.

- **Purposeful Meaning**: Hover states use 5% black overlay to signal clickability, sort icons rotate 180deg on direction flip, popovers fade in over 150ms to avoid jarring appearance
- **Hierarchy of Movement**: Only interactive elements (buttons, checkboxes, rows) respond to hover; static text remains still; popovers get priority z-index and smooth transitions

## Component Selection

- **Components**: 
  - Custom `DataGrid` component (no direct shadcn equivalent)
  - Native HTML `<table>` for semantic structure
  - Custom `IndeterminateCheckbox` with ref for select-all state
  - Custom `Popover` with portal rendering for filters/column menu
  - Icon buttons with inline SVG icons for toolbar actions
  - Input components (native) with Tailwind styling for search and filters
  
- **Customizations**: 
  - Resizable filter dropdown with drag handle
  - Auto-flipping popover positioning logic
  - Custom sort indicators with 3-state cycle
  - Padded table rows to maintain fixed height
  
- **States**: 
  - Buttons: hover (`hover:bg-black/5`), disabled (`disabled:opacity-50`)
  - Inputs: focus ring (`focus:ring`, `focus:outline-none`)
  - Checkboxes: checked, unchecked, indeterminate (via ref)
  - Table rows: hover highlight (`hover:bg-black/5`)
  - Filter funnel: active state with ring when values selected
  
- **Icon Selection**: 
  - Funnel (filter), Columns (visibility), Broom (clear), Plus/Minus (add/remove), Eye (view), Download, Refresh
  - Sort arrows (up/down/neutral)
  - All inline SVG for performance
  
- **Spacing**: 
  - Table padding: `p-3` (12px) for cells
  - Button padding: `px-3 py-2` (12px/8px)
  - Input padding: `px-2 py-1` (8px/4px) for compact filters
  - Gap between toolbar items: `gap-2` (8px)
  - Popover margin from anchor: 8px
  
- **Mobile**: 
  - Toolbar wraps to vertical on small screens (`flex-col sm:flex-row`)
  - Horizontal scroll container for table (`overflow-x-auto`)
  - Search input maintains 16rem width minimum
  - Popover pointers adjust based on available space
  - Touch-friendly 44px minimum hit areas for all interactive elements
