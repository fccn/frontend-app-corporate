# Corporate Partner Management MFE

[![License](https://img.shields.io/github/license/fccn/frontend-app-corporate.svg)](https://github.com/fccn/frontend-app-corporate/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/Status-Maintained-brightgreen)]

## Purpose

The FCCN Corporate Partner Management MFE provides a frontend interface for managing 
corporate partners, their catalogs, courses, and learner enrollment in Open edX.

This MFE serves as the administrative frontend for the [openedx-corporate](https://github.com/fccn/openedx-corporate) plugin.

## Application Views

This MFE provides four main views:

**Corporate Partner List** (`partners/`)
- **Component**: `CorporatePartnerPage` (`src/partner/CorporatePartnerPage.tsx`)
- Lists all corporate partner organizations in a searchable table. Supports creating, editing, and deleting partner organizations. Shows partner details including catalogs, courses, and enrollment statistics.

**Partner Catalogs** (`/:partnerSlug/catalogs/`)
- **Component**: `CatalogsPage` (`src/catalogs/CatalogsPage.tsx`)
- Displays all catalogs associated with a specific partner. Shows statistics including total catalogs, courses, enrollments, and certified learners. Provides quick access to catalog management.

**Catalog Detail** (`/:partnerSlug/catalogs/:catalogSlug/courses/`)
- **Component**: `CatalogDetailPage` (`src/catalogs/CatalogDetailPage.tsx`)
- Tabbed interface showing:
  - **Courses**: List of courses in the catalog
  - **Learners**: Enrolled learners with progress
  - **Enrollments**: Enrollment management
- Includes settings modal for catalog configuration.

**Course Detail** (`/:partnerSlug/catalogs/:catalogSlug/courses/:courseId/`)
- **Component**: `CourseDetailPage` (`src/catalogs/CourseDetailPage.tsx`)
- Detailed course view showing learner list and progress. Provides admin access to Superset analytics integration for data visualization.

## Getting Started

### Tutor Setup

Follow these steps to set up the Corporate Partner Management MFE with Tutor:

1. Navigate to your Tutor plugins directory:

```bash
cd "$(tutor plugins printroot)"
```

2. Create a plugin file with the following content:

```python
from tutormfe.hooks import MFE_APPS

@MFE_APPS.add()
def _add_corporate_mfe(mfes):
    mfes["corporate"] = {
        "repository": "https://github.com/fccn/frontend-app-corporate.git",
        "port": 1990,
        "version": "main",
    }
    return mfes
```

3. Enable and build:

```bash
tutor plugins enable <plugin_name>
tutor images build mfe
```

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/fccn/frontend-app-corporate.git
cd frontend-app-corporate
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

Set up your LMS URL and other environment variables as needed.

4. Run locally:

```bash
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the AGPLv3 unless otherwise noted.
