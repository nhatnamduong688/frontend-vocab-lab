# Vocabulary Lab

A React TypeScript application for vocabulary learning and sentence formation.

## Project Structure

```
vocab-lab/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API and external services
│   ├── utils/         # Utility functions
│   ├── constants/     # Constants and configuration
│   ├── types/         # TypeScript types/interfaces
│   ├── theme/         # MUI theme configuration
│   └── context/       # React context providers
├── public/           # Static files
└── build/           # Production build output
```

## Available Scripts

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will run in development mode at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Create production build
npm run build

# The build output will be in the 'build' folder
# To test the production build locally:
npx serve -s build
```

### Build Output

After running `npm run build`, the following files will be generated in the `build` directory:

- `static/js/main.[hash].js` - Main application bundle
- `static/js/[number].[hash].chunk.js` - Chunk files
- `static/css/main.[hash].css` - Compiled CSS

### Deployment

The build folder is ready to be deployed. You can serve it with any static server:

```bash
# Using serve
npm install -g serve
serve -s build

# Or using any static file server
# Example with Python
python -m http.server --directory build
```

## Development Guidelines

### Adding New Features

1. Create necessary TypeScript interfaces in `src/types/`
2. Add constants to `src/constants/`
3. Create utility functions in `src/utils/`
4. Implement custom hooks in `src/hooks/`
5. Create/update components in `src/components/`

### Code Organization

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use constants instead of magic numbers/strings
- Maintain type safety with TypeScript
- Follow the established project structure

## Dependencies

- React 18
- TypeScript 4
- Material-UI (MUI) 5
- Other dependencies can be found in `package.json`

## Browser Support

The production build is optimized for modern browsers. See `browserslist` in `package.json` for specific targets.

## Troubleshooting

### Common Build Issues

1. TypeScript Errors:

   - Ensure all files are properly typed
   - Check for missing exports in files
   - Verify interface implementations

2. Build Failures:
   - Clear the build cache: `rm -rf build`
   - Delete node_modules: `rm -rf node_modules && npm install`
   - Check for environment variables: Create `.env` if needed

### Development Issues

1. Hot Reload Not Working:

   - Check for syntax errors
   - Restart development server
   - Clear browser cache

2. Type Errors:
   - Run `tsc --noEmit` to check for type issues
   - Update TypeScript definitions if needed

## Contributing

1. Follow the established code structure
2. Maintain type safety
3. Update documentation as needed
4. Test thoroughly before submitting changes
