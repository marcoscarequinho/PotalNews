# Overview

This is a full-stack news portal application built with React and Express. The system provides both an administrative interface for content management and a public portal for viewing published articles. The application features user authentication, role-based access control, content management with categories and articles, and file upload capabilities with Google Cloud Storage integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with separate routes for authenticated and public users
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **File Uploads**: Uppy library with AWS S3 integration for direct-to-cloud uploads

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM with PostgreSQL (specifically Neon Database)
- **Authentication**: Replit Auth integration with OpenID Connect and session-based authentication
- **File Storage**: Google Cloud Storage with custom ACL (Access Control List) system for file permissions
- **API Design**: RESTful API structure with middleware for authentication and error handling

## Database Schema
- **Users Table**: Stores user profiles with role-based access (admin/editor) and authentication data
- **Categories Table**: Organizes articles with slug-based URLs and customizable colors
- **Articles Table**: Main content storage with rich text content, status management (draft/review/published), and author relationships
- **Sessions Table**: Handles user session persistence for authentication

## Authentication & Authorization
- **Authentication Provider**: Replit Auth with OpenID Connect protocol
- **Session Management**: PostgreSQL-backed session store with configurable TTL
- **Role-Based Access**: Two-tier system (admin/editor) with route-level protection
- **Authorization Middleware**: Express middleware for protecting API endpoints based on user roles

## Content Management Features
- **Rich Text Editor**: Custom WYSIWYG editor with formatting toolbar and HTML content storage
- **Image Upload**: Direct-to-cloud upload system with presigned URLs and automatic ACL policy application
- **Article Workflow**: Draft → Review → Published status progression with role-based publishing controls
- **Category Management**: Hierarchical content organization with slug-based URLs and visual categorization

## File Upload System
- **Storage Provider**: Google Cloud Storage with Replit service account integration
- **Upload Flow**: Client-side Uppy dashboard → Presigned URL generation → Direct cloud upload → Server-side ACL policy application
- **Access Control**: Custom ACL system supporting group-based permissions (read/write) with extensible access group types

## Development Environment
- **Build System**: Vite for frontend bundling with hot module replacement in development
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Development Server**: Express server with Vite middleware integration for seamless full-stack development
- **Type Safety**: End-to-end TypeScript with shared schema definitions between client and server

# External Dependencies

## Core Infrastructure
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **File Storage**: Google Cloud Storage with service account authentication via Replit sidecar
- **Authentication**: Replit Auth service with OpenID Connect integration

## Frontend Libraries
- **UI Framework**: Radix UI primitives with Shadcn/ui component system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Icons**: Font Awesome and Lucide React icon libraries
- **File Upload**: Uppy ecosystem (core, dashboard, AWS S3 plugin, drag-drop, file-input, progress-bar)

## Backend Services
- **Database Client**: @neondatabase/serverless for connection pooling and WebSocket support
- **Cloud Storage**: @google-cloud/storage SDK with credential-based authentication
- **Session Store**: connect-pg-simple for PostgreSQL session persistence

## Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Linting/Formatting**: TypeScript compiler with strict mode enabled
- **Development Plugins**: Replit-specific plugins for error overlay and cartographer integration