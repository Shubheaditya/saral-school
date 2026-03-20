# Saral School — Project Memory

This file serves as a memory store for all the important decisions, architecture plans, and stages of the Saral School project. It provides context on why things are built the way they are.

## Stage 1: Initial Vision & MVP Setup
**Objective**: Build an informational landing site for "Saral School" that mimics a gamified, mobile-first aesthetic but functions as a desktop website.
- **Tech Stack**: Next.js App Router, Tailwind CSS, React.
- **Aesthetic Guidelines**: 
  - Strictly **Light Mode Only** (removed all `dark:` classes for better contrast).
  - Pastel, vibrant color palette (indigo, emerald, amber, pink).
  - Heavy use of rounded corners (`rounded-3xl`), bouncy hover animations, and floating background elements.
  - Font: **Nunito** to convey a friendly, child-appropriate tone.
- **Honesty in Marketing**: Replaced placeholder "500+ Happy Learners / 4.9 Rating" stats with honest "In Development" messaging to manage expectations as an early-stage project.
- **Structure**: Expanded from a single page to a 3-page site (`/`, `/how-it-works`, `/about`) to house the detailed PRD content without overwhelming the user.

## Stage 2: Product Requirements (PRD) Integration
Integrated multiple core PRDs into the site's marketing and documentation.
- **Content Strategy (Human-Led AI)**: Documented the "Content Assembly Line" on the How It Works page. Interns follow strict SOPs to generate content with AI, ensuring zero drift and high alignment with the Indian K-10 market, rather than relying on complex, autonomous software automation.
- **Frictionless Onboarding**: Detailed the 6-step onboarding flow supporting parent PIN setup, avatar selection, and multi-child support (ages 6-12 target).
- **Adaptive Level Assessment**: Documented the dynamic test that calibrates students based on real-time difficulty adjustment, rather than strict age, to place them in the correct starting level.

## Stage 3: Gamified Subject UI (Kids & Explorer Mode)
**Objective**: Transform the utilitarian, plain UI into an engaging "Learning Journey Map."
- **Data Model Shift**: The backend data model (`Subject -> Semester -> Chapter -> ContentItems`) was mapped to a more child-centric frontend model:
  - `Semesters` are displayed as **"Chapters / Worlds"**.
  - `Chapters` are displayed as **"Subtopics"**.
- **Frictionless Actions**: 
  - Rather than navigating to a separate Chapter Details page, actionable buttons (**🎬 Video**, **📝 Notes**, **🎯 Practice**) were placed *directly underneath* each subtopic name and each chapter name to minimize clicks and keep kids engaged.
  - When navigating to a Subject, the first active "Chapter/World" is now automatically opened by default, instantly revealing the subtopics without requiring an additional click.
- **Visuals**: Introduced floating animated background blobs and a "Sparky the Owl" mascot for constant positive reinforcement.

## Stage 4: Parent Dashboard & Grade Override
**Objective**: Give parents control over their child's learning placement.
- **Learning Settings**: Built a PIN-protected **Parent Dashboard** inside the Profile tab.
- **Manual Grade Override**: Parents can change the `assignedSemester` (1-18) setting, safely overriding the automatic age-based placement.
- **State Refresh**: When a parent changes a grade, a hard reload (`window.location.href = "/learn"`) is triggered to instantly rebuild the learning map for the newly assigned syllabus.

## Stage 5: Conditional UI & Graduated Independence (Scholar Mode)
**Objective**: The UI should grow up with the student, shifting from highly gamified to more serious, and handing over control to older students.
- **Age/Grade Linked UI Theme**: 
  - Semesters 1-4 (K-2): Routes to `kids` mode. 
  - Semesters 5-10 (3-6): Routes to `explorer` mode.
  - Semesters 11+ (7+): Routes to `scholar` mode.
  - *Note*: This is driven by the `assignedSemester` override first; if not set, it falls back to age calculated from birthdate.
- **Scholar Autonomy**: 
  - If the student is in Scholar mode (Sem 11+), the 4-digit Parent PIN lock is bypassed on the profile settings page.
  - The "Parent Dashboard" tab is renamed to **"Learning Dashboard"**, empowering older students to view their own insights.

## Stage 6: Universal Theming & Unified Navigation
**Objective**: Ensure the entire app adapts its aesthetic instantly based on the active user's age group, while maintaining a consistent mental model for finding settings and navigation.
- **Dynamic Sub-Pages**: The Profile, Scoreboard, and Practice pages intercept `currentUser.ageGroup` to reskin themselves dynamically (e.g., Kids = pastel & squishy 3D borders, Explorer = dark neon gradients, Scholar = sleek light/dark glassmorphism).
- **Unified Corner Dashboards**: Removed mode-specific bulky sidebars or central dashboards. All modes now utilize a unified top-right `<TopProfileBar />` (for avatar, rank, and quick settings) and a singular sticky `<BottomNav />` for core routing, bringing much-needed uniformity to the UI layout.
- **Strict Semester Filtering**: To prevent overwhelming the student, the Subject Detail views (`/learn/subject/[id]`) now strictly filter the data model to *only* display the specific `Semester` (which are presented as Chapters/Regions) that matches the student's current learning grade, hiding previous or advanced material.

---
## Stage 7: Production Backend & Analytics (WIP)
**Objective**: Transition from local mock data to a persistent, cloud-based architecture and implement usage tracking to monitor real-world learning.
- **Storage & Database (Supabase)**: 
  - Overhaul the hardcoded `AppContext` to synchronize with a Supabase PostgreSQL database.
  - Integrate Supabase Storage buckets so admins can securely upload real `.mp4` video lectures and `.pdf` notes.
  - The Learner UI will automatically fetch these secure URLs from the database, allowing global access without inflating the application's bundle size.
- **Usage Tracking (Vercel Web Analytics)**:
  - Inject the `@vercel/analytics` component into the root layout.
  - This provides a privacy-friendly, zero-config dashboard directly in Vercel to monitor daily visitors, active users, page views, and geographic distribution.

*Updated: March 2026*
