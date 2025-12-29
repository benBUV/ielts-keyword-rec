# Question Bank Metadata Centralization - Implementation Plan

## 📋 Document Overview

**Objective**: Centralize question bank metadata management by moving metadata from the loader component into individual question bank files.

**Date**: 2025-11-18  
**Status**: Planning Phase  
**Priority**: Medium

---

## 1. Current State Analysis

### 1.1 Current Question Bank File Structure

**Location**: `src/data/question-banks/*.ts`

**Current Structure** (Example: `default.ts`):
```typescript
import { Question, QuestionType } from '@/types';

export const defaultQuestions: Question[] = [
  {
    id: 'q1',
    type: QuestionType.Part1,
    text: 'Do you work or are you a student?',
    media: 'https://www.youtube.com/watch?v=NpEaa2P7qZI',
    speakingDuration: 20,
  },
  // ... more questions
];
```

**Current Data**:
- ✅ Questions array with full question details
- ❌ NO metadata (id, name, description)
- ❌ NO version information
- ❌ NO tags or categories
- ❌ NO author information

**Files**:
- `default.ts` - Exports `defaultQuestions`
- `technology.ts` - Exports `technologyQuestions`
- `education.ts` - Exports `educationQuestions`
- `environment.ts` - Exports `environmentQuestions`

---

### 1.2 Current Question Bank Loader Structure

**Location**: `src/utils/question-bank-loader.ts`

**Current Implementation**:
```typescript
export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// Metadata is DECLARED HERE (not in bank files)
export const questionBanks: Record<string, QuestionBank> = {
  default: {
    id: 'default',
    name: 'General Topics',
    description: 'A mix of general IELTS speaking topics...',
    questions: defaultQuestions, // Imported from file
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    description: 'Questions focused on technology...',
    questions: technologyQuestions, // Imported from file
  },
  // ... more banks
};
```

**Current Responsibilities**:
1. ✅ Imports question arrays from bank files
2. ✅ Declares metadata (id, name, description) for each bank
3. ✅ Creates `QuestionBank` objects combining metadata + questions
4. ✅ Provides `loadQuestionBank()` function for URL-based loading
5. ✅ Provides `getAvailableQuestionBanks()` for listing all banks

**Problem**: Metadata is separated from the question data, making it harder to maintain and update.

---

## 2. Desired End State

### 2.1 Self-Contained Question Banks

**Goal**: Each question bank file should contain:
- ✅ Metadata (id, name, description, version, tags, etc.)
- ✅ Questions array
- ✅ All information needed to use the bank

**Example Structure**:
```typescript
import { Question, QuestionType } from '@/types';

export const defaultQuestionBank = {
  metadata: {
    id: 'default',
    name: 'General Topics',
    description: 'A mix of general IELTS speaking topics including work, travel, and tourism',
    version: '1.0.0',
    tags: ['general', 'work', 'travel', 'tourism'],
    author: 'IELTS Practice Team',
    lastModified: '2025-11-18',
    difficulty: 'intermediate',
  },
  questions: [
    {
      id: 'q1',
      type: QuestionType.Part1,
      text: 'Do you work or are you a student?',
      media: 'https://www.youtube.com/watch?v=NpEaa2P7qZI',
      speakingDuration: 20,
    },
    // ... more questions
  ],
};
```

---

### 2.2 Simplified Loader

**Goal**: Loader should:
- ✅ Import question banks (with metadata already included)
- ✅ Provide access functions
- ❌ NOT declare metadata (read from banks instead)

**Example Structure**:
```typescript
import { defaultQuestionBank } from '@/data/question-banks/default';
import { technologyQuestionBank } from '@/data/question-banks/technology';
// ... more imports

// Simple registry - just map IDs to imported banks
export const questionBanks = {
  [defaultQuestionBank.metadata.id]: defaultQuestionBank,
  [technologyQuestionBank.metadata.id]: technologyQuestionBank,
  // ... more banks
};

// Or even better: auto-discovery
export const questionBanks = [
  defaultQuestionBank,
  technologyQuestionBank,
  educationQuestionBank,
  environmentQuestionBank,
].reduce((acc, bank) => {
  acc[bank.metadata.id] = bank;
  return acc;
}, {} as Record<string, QuestionBank>);
```

---

## 3. Proposed Technical Implementation

### 3.1 New Type Definitions

**Location**: `src/types/index.ts` (or new file `src/types/question-bank.ts`)

```typescript
/**
 * Metadata for a question bank
 */
export interface QuestionBankMetadata {
  id: string;                    // Unique identifier (e.g., 'default', 'technology')
  name: string;                  // Display name (e.g., 'General Topics')
  description: string;           // Brief description for users
  version: string;               // Semantic version (e.g., '1.0.0')
  tags: string[];                // Categorization tags
  author?: string;               // Creator/maintainer
  lastModified: string;          // ISO date string (YYYY-MM-DD)
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Optional difficulty level
  questionCount?: number;        // Auto-calculated or manual
  estimatedDuration?: number;    // Total estimated time in minutes
}

/**
 * Complete question bank with metadata and questions
 */
export interface QuestionBank {
  metadata: QuestionBankMetadata;
  questions: Question[];
}
```

---

### 3.2 New Question Bank File Structure

**Template** (for all bank files):

```typescript
import { Question, QuestionType, QuestionBank } from '@/types';

export const defaultQuestionBank: QuestionBank = {
  metadata: {
    id: 'default',
    name: 'General Topics',
    description: 'A mix of general IELTS speaking topics including work, travel, and tourism',
    version: '1.0.0',
    tags: ['general', 'work', 'travel', 'tourism'],
    author: 'IELTS Practice Team',
    lastModified: '2025-11-18',
    difficulty: 'intermediate',
  },
  questions: [
    {
      id: 'q1',
      type: QuestionType.Part1,
      text: 'Do you work or are you a student?',
      media: 'https://www.youtube.com/watch?v=NpEaa2P7qZI',
      speakingDuration: 20,
    },
    // ... more questions
  ],
};
```

**Key Changes**:
1. Export name changes: `defaultQuestions` → `defaultQuestionBank`
2. Structure changes: Array → Object with `metadata` and `questions`
3. Metadata included: All bank information in one place

---

### 3.3 Updated Loader Logic

**Location**: `src/utils/question-bank-loader.ts`

**New Implementation**:

```typescript
import { QuestionBank, Question } from '@/types';
import { defaultQuestionBank } from '@/data/question-banks/default';
import { technologyQuestionBank } from '@/data/question-banks/technology';
import { educationQuestionBank } from '@/data/question-banks/education';
import { environmentQuestionBank } from '@/data/question-banks/environment';

/**
 * Registry of all available question banks
 * Metadata is read from the bank files themselves
 */
export const questionBanks: Record<string, QuestionBank> = {
  [defaultQuestionBank.metadata.id]: defaultQuestionBank,
  [technologyQuestionBank.metadata.id]: technologyQuestionBank,
  [educationQuestionBank.metadata.id]: educationQuestionBank,
  [environmentQuestionBank.metadata.id]: environmentQuestionBank,
};

/**
 * Alternative: Auto-discovery approach
 */
const allBanks = [
  defaultQuestionBank,
  technologyQuestionBank,
  educationQuestionBank,
  environmentQuestionBank,
];

export const questionBanksAuto = allBanks.reduce((acc, bank) => {
  acc[bank.metadata.id] = bank;
  return acc;
}, {} as Record<string, QuestionBank>);

/**
 * Get URL query parameters
 */
export const getQueryParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

/**
 * Load questions based on URL query parameter
 * Supports: ?bank=technology or ?questionBank=education
 */
export const loadQuestionBank = (): {
  questions: Question[];
  bankInfo: QuestionBank;
  error?: string;
} => {
  const params = getQueryParams();
  const bankId = params.get('bank') || params.get('questionBank') || 'default';

  console.log('Loading question bank:', bankId);

  const bank = questionBanks[bankId.toLowerCase()];

  if (!bank) {
    console.warn(`Question bank "${bankId}" not found. Using default.`);
    return {
      questions: questionBanks.default.questions,
      bankInfo: questionBanks.default,
      error: `Question bank "${bankId}" not found. Loaded default questions instead.`,
    };
  }

  console.log(`Loaded question bank: ${bank.metadata.name} (${bank.questions.length} questions)`);

  return {
    questions: bank.questions,
    bankInfo: bank,
  };
};

/**
 * Get list of all available question banks
 */
export const getAvailableQuestionBanks = (): QuestionBank[] => {
  return Object.values(questionBanks);
};

/**
 * Get question bank by ID
 */
export const getQuestionBankById = (id: string): QuestionBank | undefined => {
  return questionBanks[id];
};

/**
 * Search question banks by tag
 */
export const searchQuestionBanksByTag = (tag: string): QuestionBank[] => {
  return Object.values(questionBanks).filter(bank =>
    bank.metadata.tags.includes(tag.toLowerCase())
  );
};

/**
 * Filter question banks by difficulty
 */
export const filterQuestionBanksByDifficulty = (
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): QuestionBank[] => {
  return Object.values(questionBanks).filter(
    bank => bank.metadata.difficulty === difficulty
  );
};
```

**Key Changes**:
1. ✅ Imports now get full `QuestionBank` objects (not just question arrays)
2. ✅ Metadata is read from imported banks (not declared in loader)
3. ✅ Registry uses `bank.metadata.id` as key
4. ✅ Added new utility functions (search by tag, filter by difficulty)
5. ✅ Cleaner, more maintainable code

---

### 3.4 Data Integrity & Validation

**Validation Function**:

```typescript
/**
 * Validate question bank structure and metadata
 */
export const validateQuestionBank = (bank: QuestionBank): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Check metadata
  if (!bank.metadata) {
    errors.push('Missing metadata object');
    return { valid: false, errors };
  }

  // Required fields
  if (!bank.metadata.id || bank.metadata.id.trim() === '') {
    errors.push('Missing or empty metadata.id');
  }
  if (!bank.metadata.name || bank.metadata.name.trim() === '') {
    errors.push('Missing or empty metadata.name');
  }
  if (!bank.metadata.description || bank.metadata.description.trim() === '') {
    errors.push('Missing or empty metadata.description');
  }
  if (!bank.metadata.version || bank.metadata.version.trim() === '') {
    errors.push('Missing or empty metadata.version');
  }
  if (!Array.isArray(bank.metadata.tags)) {
    errors.push('metadata.tags must be an array');
  }

  // Check questions
  if (!Array.isArray(bank.questions)) {
    errors.push('questions must be an array');
  } else if (bank.questions.length === 0) {
    errors.push('questions array is empty');
  }

  // Validate each question
  bank.questions.forEach((q, index) => {
    if (!q.id) errors.push(`Question ${index}: missing id`);
    if (!q.type) errors.push(`Question ${index}: missing type`);
    if (!q.text) errors.push(`Question ${index}: missing text`);
    if (typeof q.speakingDuration !== 'number') {
      errors.push(`Question ${index}: invalid speakingDuration`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate all question banks on load
 */
export const validateAllQuestionBanks = (): void => {
  console.log('🔍 Validating question banks...');
  
  Object.entries(questionBanks).forEach(([id, bank]) => {
    const result = validateQuestionBank(bank);
    if (!result.valid) {
      console.error(`❌ Question bank "${id}" validation failed:`, result.errors);
    } else {
      console.log(`✅ Question bank "${id}" validated successfully`);
    }
  });
};

// Run validation on module load (development only)
if (import.meta.env.DEV) {
  validateAllQuestionBanks();
}
```

**Error Handling**:
- ✅ Validate on module load (development mode)
- ✅ Log validation errors to console
- ✅ Graceful fallback to default bank if invalid
- ✅ Type safety with TypeScript

---

## 4. Migration Strategy

### 4.1 Migration Steps

**Phase 1: Preparation**
1. ✅ Create new type definitions (`QuestionBankMetadata`, updated `QuestionBank`)
2. ✅ Add validation functions
3. ✅ Create migration script (optional)

**Phase 2: Update Question Bank Files**
1. ✅ Update `default.ts`:
   - Add metadata object
   - Wrap questions in new structure
   - Change export name
2. ✅ Update `technology.ts` (same process)
3. ✅ Update `education.ts` (same process)
4. ✅ Update `environment.ts` (same process)

**Phase 3: Update Loader**
1. ✅ Update imports (new export names)
2. ✅ Remove metadata declarations
3. ✅ Update registry to use `bank.metadata.id`
4. ✅ Add validation calls

**Phase 4: Update Consumers**
1. ✅ Check all files that import from loader
2. ✅ Update to use `bank.metadata.name` instead of `bank.name`
3. ✅ Update to use `bank.metadata.description` instead of `bank.description`

**Phase 5: Testing**
1. ✅ Test question bank loading
2. ✅ Test URL parameter switching
3. ✅ Test validation
4. ✅ Test all consumer components

---

### 4.2 Detailed Migration Process

**Step 1: Update Types** (`src/types/index.ts`)

```typescript
// Add new interfaces
export interface QuestionBankMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  author?: string;
  lastModified: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Update existing interface
export interface QuestionBank {
  metadata: QuestionBankMetadata;  // NEW
  questions: Question[];
}
```

---

**Step 2: Migrate Each Question Bank File**

**Before** (`default.ts`):
```typescript
export const defaultQuestions: Question[] = [
  // questions...
];
```

**After** (`default.ts`):
```typescript
export const defaultQuestionBank: QuestionBank = {
  metadata: {
    id: 'default',
    name: 'General Topics',
    description: 'A mix of general IELTS speaking topics including work, travel, and tourism',
    version: '1.0.0',
    tags: ['general', 'work', 'travel', 'tourism'],
    author: 'IELTS Practice Team',
    lastModified: '2025-11-18',
    difficulty: 'intermediate',
  },
  questions: [
    // questions... (same as before)
  ],
};
```

**Metadata Values** (from current loader):
- `default`: name="General Topics", description="A mix of general IELTS speaking topics..."
- `technology`: name="Technology", description="Questions focused on technology..."
- `education`: name="Education", description="Questions about learning, teaching..."
- `environment`: name="Environment", description="Questions about environmental issues..."

---

**Step 3: Update Loader** (`src/utils/question-bank-loader.ts`)

**Before**:
```typescript
import { defaultQuestions } from '@/data/question-banks/default';

export const questionBanks: Record<string, QuestionBank> = {
  default: {
    id: 'default',
    name: 'General Topics',
    description: '...',
    questions: defaultQuestions,
  },
};
```

**After**:
```typescript
import { defaultQuestionBank } from '@/data/question-banks/default';

export const questionBanks: Record<string, QuestionBank> = {
  [defaultQuestionBank.metadata.id]: defaultQuestionBank,
};
```

---

**Step 4: Update Consumers**

Find all files that use question bank data:
```bash
grep -r "bankInfo\." src/
grep -r "bank\.name" src/
grep -r "bank\.description" src/
```

**Before**:
```typescript
console.log(bank.name);           // Direct property
console.log(bank.description);    // Direct property
```

**After**:
```typescript
console.log(bank.metadata.name);        // Nested in metadata
console.log(bank.metadata.description); // Nested in metadata
```

---

### 4.3 Backward Compatibility

**Option 1: Deprecation Period**
- Keep old structure for 1-2 versions
- Add deprecation warnings
- Provide migration guide

**Option 2: Adapter Pattern**
```typescript
// Temporary adapter for old code
export const getLegacyQuestionBank = (bank: QuestionBank) => {
  return {
    id: bank.metadata.id,
    name: bank.metadata.name,
    description: bank.metadata.description,
    questions: bank.questions,
  };
};
```

**Option 3: Direct Migration (Recommended)**
- Update all code at once
- No backward compatibility needed
- Cleaner, simpler codebase

---

## 5. Additional Considerations

### 5.1 Additional Metadata Fields

**Recommended Fields to Add**:

```typescript
export interface QuestionBankMetadata {
  // Core fields (required)
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  lastModified: string;

  // Optional fields
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number;     // Total time in minutes
  questionCount?: number;          // Auto-calculated
  
  // Advanced fields
  language?: string;               // 'en', 'es', etc.
  targetAudience?: string[];       // ['students', 'professionals']
  prerequisites?: string[];        // IDs of prerequisite banks
  relatedBanks?: string[];         // IDs of related banks
  isPublished?: boolean;           // Draft vs published
  createdDate?: string;            // ISO date
  contributors?: string[];         // List of contributors
  license?: string;                // 'MIT', 'CC-BY', etc.
  
  // Analytics fields
  usageCount?: number;             // How many times used
  averageScore?: number;           // Average user score
  completionRate?: number;         // % of users who complete
}
```

**Priority**:
- **High**: id, name, description, version, tags, lastModified
- **Medium**: author, difficulty, estimatedDuration
- **Low**: language, targetAudience, prerequisites, analytics

---

### 5.2 Impact on Other System Parts

**Files That May Need Updates**:

1. **PracticePage.tsx**
   - Uses `bankInfo` from `loadQuestionBank()`
   - May display `bank.name` or `bank.description`
   - Update to use `bank.metadata.*`

2. **Question Bank Selector** (if exists)
   - Lists available banks
   - Shows name and description
   - Update to use `bank.metadata.*`

3. **Analytics/Tracking** (if exists)
   - May log bank ID or name
   - Update to use `bank.metadata.*`

4. **Tests**
   - Mock question banks
   - Update to new structure

**Search for Affected Code**:
```bash
# Find all usages
grep -r "bankInfo" src/
grep -r "loadQuestionBank" src/
grep -r "getAvailableQuestionBanks" src/
grep -r "questionBanks" src/
```

---

### 5.3 Future Enhancements

**Possible Future Features**:

1. **Dynamic Loading**
   - Load banks from JSON files
   - Load banks from API
   - Hot-reload during development

2. **Bank Management UI**
   - Create new banks
   - Edit existing banks
   - Import/export banks

3. **Version Control**
   - Track bank versions
   - Rollback to previous versions
   - Compare versions

4. **Localization**
   - Multi-language support
   - Translate bank metadata
   - Translate questions

5. **Advanced Search**
   - Search by tags
   - Filter by difficulty
   - Sort by various criteria

---

## 6. Implementation Checklist

### Phase 1: Preparation ✅
- [ ] Create `QuestionBankMetadata` interface
- [ ] Update `QuestionBank` interface
- [ ] Create validation functions
- [ ] Document migration process

### Phase 2: Migrate Question Banks ✅
- [ ] Migrate `default.ts`
- [ ] Migrate `technology.ts`
- [ ] Migrate `education.ts`
- [ ] Migrate `environment.ts`

### Phase 3: Update Loader ✅
- [ ] Update imports
- [ ] Remove metadata declarations
- [ ] Update registry logic
- [ ] Add validation calls

### Phase 4: Update Consumers ✅
- [ ] Find all affected files
- [ ] Update `bank.name` → `bank.metadata.name`
- [ ] Update `bank.description` → `bank.metadata.description`
- [ ] Update any other direct property access

### Phase 5: Testing ✅
- [ ] Test question bank loading
- [ ] Test URL parameter switching (?bank=technology)
- [ ] Test validation (console logs)
- [ ] Test all consumer components
- [ ] Run lint checks
- [ ] Manual testing in browser

### Phase 6: Documentation ✅
- [ ] Update README (if needed)
- [ ] Document new structure
- [ ] Document migration process
- [ ] Add code comments

---

## 7. Risk Assessment

### Low Risk ✅
- Type-safe changes (TypeScript will catch errors)
- Small codebase (limited impact)
- Clear migration path

### Medium Risk ⚠️
- May break existing code if not all consumers updated
- Need to test all question bank switching

### Mitigation Strategies
1. ✅ Use TypeScript for compile-time checks
2. ✅ Add validation functions
3. ✅ Test thoroughly before deployment
4. ✅ Keep old structure temporarily if needed

---

## 8. Timeline Estimate

**Total Time**: 2-3 hours

- **Phase 1** (Preparation): 30 minutes
- **Phase 2** (Migrate Banks): 30 minutes
- **Phase 3** (Update Loader): 20 minutes
- **Phase 4** (Update Consumers): 30 minutes
- **Phase 5** (Testing): 30 minutes
- **Phase 6** (Documentation): 20 minutes

---

## 9. Success Criteria

The migration is successful when:

- ✅ All question banks have metadata embedded
- ✅ Loader reads metadata from banks (not declares it)
- ✅ All consumers work correctly
- ✅ No TypeScript errors
- ✅ No runtime errors
- ✅ Validation passes for all banks
- ✅ Question bank switching works via URL
- ✅ Code is cleaner and more maintainable

---

## 10. Next Steps

1. **Review this plan** with team/stakeholders
2. **Approve the approach** and timeline
3. **Begin implementation** following the checklist
4. **Test thoroughly** at each phase
5. **Deploy** when all tests pass
6. **Monitor** for any issues post-deployment

---

**Document Version**: 1.0  
**Date**: 2025-11-18  
**Status**: Ready for Implementation  
**Estimated Effort**: 2-3 hours  
**Risk Level**: Low-Medium
