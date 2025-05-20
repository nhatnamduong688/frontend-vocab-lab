const fs = require("fs");
const path = require("path");

// Đường dẫn đến file all.json
const ALL_VOCAB_PATH = path.resolve(
  __dirname,
  "./vocab-lab/public/vocabulary/all.json"
);

// Đọc file all.json hiện tại
console.log("Đọc file từ vựng hiện tại...");
let allVocabData;
try {
  allVocabData = JSON.parse(fs.readFileSync(ALL_VOCAB_PATH, "utf8"));
} catch (error) {
  console.error("Lỗi khi đọc file từ vựng:", error);
  process.exit(1);
}

// Tạo ID ngẫu nhiên
function generateId() {
  return Math.random().toString(36).substring(2, 12);
}

// Danh sách các component UI phổ biến
const componentVocabulary = [
  // Form Components
  {
    term: "Button",
    definition:
      "An interactive element that allows users to trigger an action when clicked.",
    category: "UI Components",
    example: "<Button onClick={handleSubmit}>Submit</Button>",
  },
  {
    term: "TextField",
    definition: "An input component that allows users to enter and edit text.",
    category: "UI Components",
    example: "<TextField value={name} onChange={handleChange} />",
  },
  {
    term: "Checkbox",
    definition:
      "A control component that allows users to select multiple options from a set.",
    category: "UI Components",
    example: "<Checkbox checked={isChecked} onChange={handleChange} />",
  },
  {
    term: "RadioButton",
    definition:
      "A control component that allows users to select one option from a set.",
    category: "UI Components",
    example: "<RadioButton selected={option === 'first'} value='first' />",
  },
  {
    term: "Select",
    definition:
      "A control component that allows users to select an option from a dropdown list.",
    category: "UI Components",
    example: "<Select value={country} onChange={handleCountryChange}></Select>",
  },
  {
    term: "Slider",
    definition:
      "An input component that allows users to select a value from a range by dragging a thumb.",
    category: "UI Components",
    example: "<Slider min={0} max={100} value={50} />",
  },
  {
    term: "Switch",
    definition:
      "A control component that allows users to toggle between two states.",
    category: "UI Components",
    example: "<Switch checked={isEnabled} onChange={toggleFeature} />",
  },
  {
    term: "DatePicker",
    definition:
      "A component that allows users to select a date from a calendar interface.",
    category: "UI Components",
    example:
      "<DatePicker selected={startDate} onChange={date => setStartDate(date)} />",
  },
  {
    term: "FileUpload",
    definition: "A component that allows users to select and upload files.",
    category: "UI Components",
    example: "<FileUpload accept='image/*' onUpload={handleUpload} />",
  },
  {
    term: "FormGroup",
    definition: "A container component that groups form controls together.",
    category: "UI Components",
    example: "<FormGroup><Label>Name</Label><Input /></FormGroup>",
  },

  // Navigation Components
  {
    term: "Navbar",
    definition:
      "A navigation component typically displayed at the top of a page.",
    category: "Navigation Components",
    example: "<Navbar><NavItem>Home</NavItem><NavItem>About</NavItem></Navbar>",
  },
  {
    term: "Drawer",
    definition:
      "A panel that slides in from the edge of the screen, often used for navigation on mobile.",
    category: "Navigation Components",
    example: "<Drawer open={isOpen} onClose={handleClose}></Drawer>",
  },
  {
    term: "Tabs",
    definition:
      "A component that organizes content into separate views that can be accessed by selecting tabs.",
    category: "Navigation Components",
    example:
      "<Tabs value={tab} onChange={handleChange}><Tab label='Overview' /><Tab label='Details' /></Tabs>",
  },
  {
    term: "Breadcrumbs",
    definition:
      "A navigation component that shows the user's location in a website hierarchy.",
    category: "Navigation Components",
    example:
      "<Breadcrumbs><Link to='/'>Home</Link><Link to='/products'>Products</Link></Breadcrumbs>",
  },
  {
    term: "Pagination",
    definition:
      "A component that allows users to navigate through multiple pages of content.",
    category: "Navigation Components",
    example: "<Pagination count={10} page={page} onChange={handleChange} />",
  },
  {
    term: "Menu",
    definition: "A component that displays a list of options when triggered.",
    category: "Navigation Components",
    example:
      "<Menu open={isOpen} onClose={handleClose}><MenuItem>Profile</MenuItem></Menu>",
  },
  {
    term: "Stepper",
    definition:
      "A component that displays progress through a sequence of steps.",
    category: "Navigation Components",
    example:
      "<Stepper activeStep={1}><Step label='Cart' /><Step label='Delivery' /></Stepper>",
  },

  // Layout Components
  {
    term: "Card",
    definition:
      "A container component that groups related content and actions.",
    category: "Layout Components",
    example:
      "<Card><CardHeader title='Title' /><CardContent>Content here</CardContent></Card>",
  },
  {
    term: "Grid",
    definition: "A layout component that arranges items in rows and columns.",
    category: "Layout Components",
    example:
      "<Grid container><Grid item xs={6}>Left</Grid><Grid item xs={6}>Right</Grid></Grid>",
  },
  {
    term: "Container",
    definition:
      "A layout component that centers content horizontally and applies consistent margins.",
    category: "Layout Components",
    example: "<Container maxWidth='md'>Content here</Container>",
  },
  {
    term: "Divider",
    definition: "A component that creates a line separator between content.",
    category: "Layout Components",
    example: "<div>Section 1</div><Divider /><div>Section 2</div>",
  },
  {
    term: "Paper",
    definition:
      "A surface component that resembles a sheet of paper with shadow effects.",
    category: "Layout Components",
    example: "<Paper elevation={3}>Content with shadow effect</Paper>",
  },
  {
    term: "Box",
    definition: "A basic layout component with style utility functions.",
    category: "Layout Components",
    example: "<Box m={2} p={1} bgcolor='background.paper'>Styled box</Box>",
  },
  {
    term: "Collapse",
    definition:
      "A component that animates the height of its children when showing or hiding them.",
    category: "Layout Components",
    example: "<Collapse in={expanded}><div>Expanded content</div></Collapse>",
  },
  {
    term: "List",
    definition:
      "A component that displays a series of items in a vertical column.",
    category: "Layout Components",
    example:
      "<List><ListItem>Item 1</ListItem><ListItem>Item 2</ListItem></List>",
  },
  {
    term: "Table",
    definition: "A component that displays data in rows and columns.",
    category: "Layout Components",
    example:
      "<Table><TableHead><TableRow><TableCell>Name</TableCell></TableRow></TableHead></Table>",
  },

  // Feedback Components
  {
    term: "Alert",
    definition:
      "A component that displays a short, important message to get the user's attention.",
    category: "Feedback Components",
    example: "<Alert severity='success'>Operation successful!</Alert>",
  },
  {
    term: "Snackbar",
    definition:
      "A component that displays brief notifications at the bottom of the screen.",
    category: "Feedback Components",
    example: "<Snackbar open={open} message='Changes saved' />",
  },
  {
    term: "Dialog",
    definition:
      "A modal window that appears in front of the app content to provide critical information or request input.",
    category: "Feedback Components",
    example:
      "<Dialog open={open} onClose={handleClose}><DialogTitle>Confirm</DialogTitle></Dialog>",
  },
  {
    term: "ProgressBar",
    definition: "A component that indicates the progress of an operation.",
    category: "Feedback Components",
    example: "<ProgressBar value={75} />",
  },
  {
    term: "Skeleton",
    definition:
      "A placeholder component that simulates the layout of content before it loads.",
    category: "Feedback Components",
    example: "<Skeleton variant='text' width={200} height={40} />",
  },
  {
    term: "Tooltip",
    definition:
      "A component that displays informative text when users hover over, focus on, or tap an element.",
    category: "Feedback Components",
    example: "<Tooltip title='Delete'><Button>X</Button></Tooltip>",
  },
  {
    term: "Badge",
    definition:
      "A small status descriptor for UI elements that typically appears as a colored dot or count.",
    category: "Feedback Components",
    example: "<Badge badgeContent={4} color='primary'><MailIcon /></Badge>",
  },
  {
    term: "Toast",
    definition:
      "A non-modal alert that appears temporarily and disappears automatically.",
    category: "Feedback Components",
    example: "<Toast show={show} onClose={handleClose}>Success!</Toast>",
  },
];

// Thêm nhiều component nữa để đạt gần 100 từ
const additionalComponents = [
  // Form Components
  {
    term: "Autocomplete",
    definition: "A text input component with suggestions as the user types.",
    category: "UI Components",
    example: "<Autocomplete options={countries} onChange={handleChange} />",
  },
  {
    term: "MultiSelect",
    definition:
      "A select component that allows users to select multiple options.",
    category: "UI Components",
    example:
      "<MultiSelect options={options} selected={selected} onChange={handleChange} />",
  },
  {
    term: "TagInput",
    definition:
      "An input component that allows users to enter multiple tags or keywords.",
    category: "UI Components",
    example: "<TagInput tags={tags} onAdd={addTag} onRemove={removeTag} />",
  },
  {
    term: "ColorPicker",
    definition:
      "A component that allows users to select a color from a palette.",
    category: "UI Components",
    example: "<ColorPicker color={color} onChange={handleColorChange} />",
  },
  {
    term: "RichTextEditor",
    definition:
      "A component that provides text formatting capabilities for content creation.",
    category: "UI Components",
    example: "<RichTextEditor value={content} onChange={setContent} />",
  },
  {
    term: "PasswordField",
    definition:
      "A text field component designed for password input with show/hide functionality.",
    category: "UI Components",
    example: "<PasswordField value={password} onChange={handleChange} />",
  },
  {
    term: "SearchBar",
    definition: "An input component optimized for search functionality.",
    category: "UI Components",
    example: "<SearchBar value={query} onSearch={handleSearch} />",
  },
  {
    term: "NumberInput",
    definition:
      "A specialized input for numerical values with increment/decrement controls.",
    category: "UI Components",
    example:
      "<NumberInput value={quantity} min={1} max={10} onChange={handleChange} />",
  },
  {
    term: "OTPInput",
    definition:
      "A specialized input for entering one-time passwords or verification codes.",
    category: "UI Components",
    example: "<OTPInput length={6} onChange={handleOtpChange} />",
  },
  {
    term: "Rating",
    definition:
      "A component that displays a rating using stars or other symbols and allows user input.",
    category: "UI Components",
    example: "<Rating value={4.5} max={5} onChange={handleRatingChange} />",
  },
  {
    term: "TimePicker",
    definition: "A component that allows users to select a time.",
    category: "UI Components",
    example: "<TimePicker value={time} onChange={handleTimeChange} />",
  },
  {
    term: "DateRangePicker",
    definition: "A component that allows users to select a start and end date.",
    category: "UI Components",
    example:
      "<DateRangePicker startDate={start} endDate={end} onChange={handleDateChange} />",
  },

  // Navigation Components
  {
    term: "BottomNavigation",
    definition:
      "A navigation component typically displayed at the bottom of mobile interfaces.",
    category: "Navigation Components",
    example:
      "<BottomNavigation value={value} onChange={handleChange}><BottomNavigationAction label='Home' /></BottomNavigation>",
  },
  {
    term: "SideNav",
    definition:
      "A vertical navigation component typically displayed on the side of the page.",
    category: "Navigation Components",
    example: "<SideNav items={navItems} activeItem={currentPage} />",
  },
  {
    term: "NavLink",
    definition:
      "A link component specifically designed for navigation with active state.",
    category: "Navigation Components",
    example: "<NavLink to='/home' activeClassName='active'>Home</NavLink>",
  },
  {
    term: "Dropdown",
    definition:
      "A clickable element that reveals a list of options or content.",
    category: "Navigation Components",
    example:
      "<Dropdown toggle={toggleDropdown} isOpen={isOpen}><DropdownItem>Option</DropdownItem></Dropdown>",
  },
  {
    term: "TreeView",
    definition:
      "A component that displays hierarchical data in a tree-like structure.",
    category: "Navigation Components",
    example:
      "<TreeView><TreeItem nodeId='1' label='Parent'><TreeItem nodeId='2' label='Child' /></TreeItem></TreeView>",
  },
  {
    term: "Accordion",
    definition:
      "A component with expandable panels that can be toggled to reveal content.",
    category: "Navigation Components",
    example:
      "<Accordion><AccordionSummary>Title</AccordionSummary><AccordionDetails>Content</AccordionDetails></Accordion>",
  },

  // Layout Components
  {
    term: "Flex",
    definition:
      "A layout component that uses CSS flexbox for flexible layouts.",
    category: "Layout Components",
    example:
      "<Flex direction='row' justify='space-between'><Box>1</Box><Box>2</Box></Flex>",
  },
  {
    term: "Stack",
    definition:
      "A layout component that arranges children in a vertical or horizontal stack with spacing.",
    category: "Layout Components",
    example:
      "<Stack spacing={2} direction='vertical'><Item>1</Item><Item>2</Item></Stack>",
  },
  {
    term: "Masonry",
    definition:
      "A layout component that creates a grid of items with varying heights.",
    category: "Layout Components",
    example:
      "<Masonry columns={3}>{items.map(item => <Item key={item.id} />)}</Masonry>",
  },
  {
    term: "AspectRatio",
    definition:
      "A layout component that maintains a specific aspect ratio for its content.",
    category: "Layout Components",
    example: "<AspectRatio ratio={16/9}><img src='image.jpg' /></AspectRatio>",
  },
  {
    term: "Spacer",
    definition:
      "A utility component that creates empty space between elements.",
    category: "Layout Components",
    example: "<Box>Content</Box><Spacer size={2} /><Box>More content</Box>",
  },
  {
    term: "Portal",
    definition:
      "A component that renders children into a DOM node outside the parent hierarchy.",
    category: "Layout Components",
    example: "<Portal container={document.body}><Modal /></Portal>",
  },
  {
    term: "Sticky",
    definition:
      "A component that stays fixed at a specific position as the user scrolls.",
    category: "Layout Components",
    example: "<Sticky top={0}><Navbar /></Sticky>",
  },
  {
    term: "Timeline",
    definition:
      "A component that displays a series of events in chronological order.",
    category: "Layout Components",
    example:
      "<Timeline><TimelineItem>Event 1</TimelineItem><TimelineItem>Event 2</TimelineItem></Timeline>",
  },

  // Feedback Components
  {
    term: "Spinner",
    definition:
      "A loading indicator component that shows an animation while content loads.",
    category: "Feedback Components",
    example: "<Spinner size='medium' color='primary' />",
  },
  {
    term: "Backdrop",
    definition:
      "A component that covers the entire screen to focus attention on a foreground element.",
    category: "Feedback Components",
    example: "<Backdrop open={loading}><CircularProgress /></Backdrop>",
  },
  {
    term: "Modal",
    definition:
      "A dialog box/popup window that appears on top of the current page.",
    category: "Feedback Components",
    example:
      "<Modal open={isOpen} onClose={handleClose}><div>Modal content</div></Modal>",
  },
  {
    term: "Popover",
    definition:
      "A component that displays floating content next to a trigger element.",
    category: "Feedback Components",
    example:
      "<Popover open={open} anchorEl={anchorEl}><Paper>Popover content</Paper></Popover>",
  },
  {
    term: "ProgressCircle",
    definition:
      "A circular progress indicator that shows completion percentage.",
    category: "Feedback Components",
    example: "<ProgressCircle value={75} size={40} />",
  },
  {
    term: "Chip",
    definition:
      "A compact element that represents an input, attribute, or action.",
    category: "Feedback Components",
    example: "<Chip label='React' onDelete={handleDelete} />",
  },

  // Data Display Components
  {
    term: "Avatar",
    definition:
      "A component that represents a user, group, or entity with an image, icon, or initials.",
    category: "Data Display Components",
    example: "<Avatar src='user.jpg' alt='User' />",
  },
  {
    term: "Icon",
    definition:
      "A graphical symbol used to represent a function, concept, or entity.",
    category: "Data Display Components",
    example: "<Icon name='home' size={24} color='primary' />",
  },
  {
    term: "Image",
    definition:
      "A component that displays an image with additional functionality like lazy loading.",
    category: "Data Display Components",
    example: "<Image src='image.jpg' alt='Description' lazy={true} />",
  },
  {
    term: "DataGrid",
    definition:
      "A powerful table component with sorting, filtering, and pagination capabilities.",
    category: "Data Display Components",
    example: "<DataGrid rows={rows} columns={columns} pageSize={5} />",
  },
  {
    term: "Chart",
    definition:
      "A component that visualizes data in various formats like bar, line, or pie charts.",
    category: "Data Display Components",
    example: "<Chart type='bar' data={chartData} options={chartOptions} />",
  },
  {
    term: "Calendar",
    definition:
      "A component that displays days, weeks, or months in a grid format.",
    category: "Data Display Components",
    example: "<Calendar value={date} onChange={handleDateChange} />",
  },
  {
    term: "Carousel",
    definition: "A slideshow component for cycling through elements.",
    category: "Data Display Components",
    example:
      "<Carousel><Slide>Image 1</Slide><Slide>Image 2</Slide></Carousel>",
  },
  {
    term: "Tag",
    definition: "A component that categorizes or marks content with keywords.",
    category: "Data Display Components",
    example: "<Tag color='blue'>New</Tag>",
  },
];

// Combine all components
const allComponents = [...componentVocabulary, ...additionalComponents];

// Enrich component data
const enrichedComponents = allComponents.map((item) => ({
  id: generateId(),
  type: "component",
  difficulty:
    Math.random() > 0.7 ? "hard" : Math.random() > 0.4 ? "medium" : "easy",
  frequency: Math.floor(Math.random() * 100),
  interviewImportance:
    Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
  description: item.definition,
  relatedTerms: [],
  codeExample: item.example || "",
  commonQuestions: [],
  createdAt: Date.now(),
  ...item,
}));

// Thêm từ vựng mới vào dữ liệu hiện có, tránh trùng lặp
const existingTerms = new Set(
  allVocabData.vocabulary.map((item) => item.term.toLowerCase())
);
const filteredNewVocabulary = enrichedComponents.filter(
  (item) => !existingTerms.has(item.term.toLowerCase())
);

console.log(`Thêm ${filteredNewVocabulary.length} từ vựng component mới...`);
allVocabData.vocabulary = [
  ...allVocabData.vocabulary,
  ...filteredNewVocabulary,
];

// Cập nhật metadata
allVocabData.metadata.totalTerms = allVocabData.vocabulary.length;
allVocabData.metadata.lastUpdated = new Date().toISOString();

// Cập nhật danh sách categories (loại bỏ trùng lặp)
const uniqueCategories = new Set([
  ...allVocabData.metadata.categories,
  ...Array.from(new Set(filteredNewVocabulary.map((item) => item.category))),
]);
allVocabData.metadata.categories = Array.from(uniqueCategories);

// Lưu file cập nhật
fs.writeFileSync(ALL_VOCAB_PATH, JSON.stringify(allVocabData, null, 2), "utf8");
console.log(
  `Đã cập nhật file từ vựng với tổng số ${allVocabData.vocabulary.length} từ.`
);
console.log(
  'Chạy lệnh "npm run dev" để phân loại từ vựng và khởi động ứng dụng.'
);
