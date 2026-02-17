# Reactory Form Editor - Project Structure & Build Process

## Build Process Analysis
**Primary Build Command**: `npm run rollup`  
**Location**: `/Users/wweber/Source/reactory/reactory-data/plugins/reactory-client-core/`

## Current Project Structure
```
reactory-data/plugins/reactory-client-core/
├── src/
│   └── components/
│       └── Develop/
│           ├── FormEditor.tsx          # Main editor component
│           ├── requirement.md          # Requirements document
│           └── phase-tracker.md        # This tracking document
├── package.json                        # Dependencies and scripts
├── rollup.config.js                   # Rollup configuration
└── tsconfig.json                      # TypeScript configuration
```

## Build Process Analysis - COMPLETED ✅

### 1. Rollup Configuration Analysis ✅
- **Config File**: `rollup.config.cjs` (CommonJS format)
- **Entry Point**: `./src/index.ts`
- **Output**: UMD format with sourcemaps
  - Dev: `./lib/reactory.client.core.js`
  - Prod: `./lib/reactory.client.core.min.js`
- **External Dependencies**: React and ReactDOM (not bundled)
- **Plugins**: TypeScript, Babel, CommonJS, Node Resolve, Replace, JSX

### 2. Package.json Dependencies ✅
- **Current Dependencies**: 
  - @reactorynet/reactory-core (local file)
  - core-js, styled-jsx
- **Peer Dependencies**: React 17.0.2, React-DOM 17.0.2
- **Dev Dependencies**: Full Babel, Rollup, TypeScript, Material UI setup
- **Build Scripts**: 
  - `yarn run rollup` → `rollup --config --bundleConfigAsCjs rollup.config.cjs`
  - Separate dev/prod builds with NODE_ENV

### 3. Component Registration System ✅
- **Plugin Architecture**: Auto-installation via window.reactory
- **Registration Pattern**: Components registered via `reactory.registerComponent()`
- **Current FormEditor**: Already registered as `reactory.FormEditor@1.0.0` with DEVELOPER role
- **Component Structure**: Each component needs nameSpace, name, version, component, roles

## Code Editor Decision - COMPLETED ✅

### Selected Code Editor: Existing JsonSchemaEditor Components
**Decision**: Use existing `@JsonSchemaEditor` components based on QuillJS (ReactQuill)

**Decision Details:**
- **Location**: `/src/components/shared/JsonSchemaEditor/`
- **Components**: `JsonSchemaEditor.tsx`, `JsonSchemaEditorComponent.tsx`, `JsonSchemaEditorWidget.tsx`
- **Bundle Impact**: Zero additional dependencies (already available)
- **Features**: JSON validation, formatting, syntax highlighting, Material UI integration
- **Build Compatibility**: Already integrated with existing build system

**Why This Decision:**
- ✅ **Already Available**: No need to add new dependencies
- ✅ **Zero Bundle Impact**: Maintains current bundle size
- ✅ **Feature Complete**: Includes all needed JSON schema editing features
- ✅ **Build Compatible**: Works with existing rollup configuration
- ✅ **Theme Integrated**: Material UI compatible styling

### Additional Dependencies Needed
- JSON Schema validator (ajv, joi) - for enhanced validation
- Drag & drop library (react-dnd, @dnd-kit) - for UI schema designer
- Debouncing utility (lodash.debounce or custom) - for auto-save
- State management (if not using existing) - for complex form state

## Phase 1 Pre-Development Tasks

### Task 0.1: Environment Setup & Analysis
**Status**: 🔴 Not Started  
**Priority**: High  
**Estimated Time**: 2-4 hours  

#### Subtasks:
- [ ] **0.1.1**: Examine current rollup.config.js
  - Document current configuration
  - Identify potential conflicts with new dependencies
  - Plan integration strategy

- [ ] **0.1.2**: Analyze package.json and dependencies
  - Document current dependency tree
  - Check for version conflicts
  - Plan new dependency integration

- [ ] **0.1.3**: Test current build process
  - Run `yarn run rollup` and document output
  - Measure build time baseline
  - Check for any existing build issues

- [ ] **0.1.4**: Evaluate bundle size impact
  - Measure current bundle size
  - Set acceptable size increase thresholds
  - Plan bundle optimization strategies

### Task 0.2: Code Editor Library Decision
**Status**: 🔴 Not Started  
**Priority**: High  
**Estimated Time**: 4-6 hours  

#### Evaluation Criteria:
- Bundle size impact on rollup build
- TypeScript support and integration
- JSON Schema features (syntax highlighting, validation)
- Rollup compatibility
- Maintenance and community support

#### Subtasks:
- [ ] **0.2.1**: Create minimal test implementations
  - Monaco Editor integration test
  - CodeMirror 6 integration test
  - Ace Editor integration test

- [ ] **0.2.2**: Build process testing
  - Test each editor with rollup build
  - Measure bundle size impact
  - Check for build errors or warnings

- [ ] **0.2.3**: Feature comparison
  - JSON Schema syntax highlighting
  - Auto-completion capabilities
  - Validation error display
  - Performance with large schemas

- [ ] **0.2.4**: Make final decision
  - Document decision rationale
  - Update phase tracker with chosen solution
  - Plan implementation approach

## Build Process Integration Strategy

### Development Workflow
1. **Local Development**: Standard React development
2. **Build Testing**: Regular `yarn run rollup` testing
3. **Bundle Analysis**: Monitor bundle size growth
4. **Performance Testing**: Editor responsiveness checks

### CI/CD Considerations
- Build process must remain compatible with existing pipeline
- Bundle size monitoring and alerts
- Rollup configuration versioning
- Dependency security scanning

## Risk Mitigation

### Bundle Size Management
- **Risk**: Large editor libraries increase bundle size significantly
- **Mitigation**: 
  - Dynamic imports for editor components
  - Code splitting at route level
  - Lazy loading of editor features

### Build Process Stability
- **Risk**: New dependencies break existing rollup configuration
- **Mitigation**:
  - Incremental dependency addition
  - Rollup configuration versioning
  - Build process testing automation

### TypeScript Compatibility
- **Risk**: New libraries have TypeScript definition conflicts
- **Mitigation**:
  - Type definition auditing
  - Custom type declarations if needed
  - Strict TypeScript compliance testing

## Next Steps

1. **Immediate** (Today): Complete Task 0.1 - Environment Setup & Analysis
2. **This Week**: Complete Task 0.2 - Code Editor Library Decision
3. **Next Week**: Begin Phase 1 Week 1-2 implementation
4. **Ongoing**: Update this document with findings and decisions

---

*This document will be updated as we investigate and understand the build process better.*
