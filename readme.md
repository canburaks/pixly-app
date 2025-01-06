# Pixly: AI-assisted Movie Recommendation Engine

Pixly is a sophisticated movie recommendation platform that leverages advanced collaborative filtering and machine learning techniques using [MovieLens data](https://grouplens.org/datasets/movielens/). Originally developed as a learning project, it evolved into a full-featured content platform with rich social features and advanced recommendation capabilities.

The basic idea relies on collaborative filtering for film recommendations. TMDB and MovieLens data are used for user-similarity computations. Roughly 40.000 people who had voted for more than 20 movies in Movielens were randomly selected. When a new user votes for 20 films, people from the database with similar cinema tastes (highly correlated people) are found. These highly similar people were assigned to this new user in less than a minute. Afterward, a score prediction for a movie not seen yet (on average  +/- 0.5 points) is computed for the user when a new film page is visited. Also, various dimensionality reduction techniques are researched and used for clustering the movies. 



## Core Features

### Recommendation Engine
- Collaborative filtering based on user similarity computations
- Content-based filtering using TMDB and MovieLens data
- Real-time prediction engine (accuracy: +/- 0.5 points)
- Sophisticated user similarity calculations for personalized recommendations
- Multi-threaded computation optimization using Cython
- Advanced clustering using dimensionality reduction techniques

### Content Management
- Comprehensive movie metadata management
- Rich text content support with CKEditor integration
- Multiple image format handling (posters, covers, hero images)
- Tag-based categorization system
- SEO-optimized content structure
- Blog system with rich media support

### Social Features
- User profiles and personalization
- Custom lists and collections
- Rating and review system
- Social media integration
- User interaction capabilities

### Search and Discovery
- Elasticsearch-powered search
- Advanced filtering options
- Tag-based browsing
- SEO-optimized content pages

## Technical Architecture

### Backend (Django)
- **Core Framework**: Django with GraphQL API
- **Performance Optimizations**:
  - Cython-optimized computational modules
  - Redis caching layer
  - Multi-threaded processing
  - Efficient database queries
- **Data Processing**:
  - NumPy for numerical computations
  - Custom algorithm implementations
  - MovieLens data integration
  - TMDB API integration

### Frontend
- **Main Application**: React-based SPA
- **Blog Platform**: [Svelte implementation](https://github.com/canburaks/pixly-blog-svelte)
- **Design System**: Atomic design with styled-components
- **API Integration**: Apollo GraphQL client

### Cloud Infrastructure (AWS)
- **Hosting**: Elastic Beanstalk
- **Database**: 
  - RDS (MySQL)
  - Elasticache (Redis)
- **Storage**: S3 for media files
- **Security**: 
  - SSL/TLS encryption
  - CORS configuration
  - Secure cookie handling

### External Integrations
- TMDB API for movie data
- YouTube API for video content
- Social media platforms
- Search engine optimization tools

## Tech Stack

### Cloud Services
- [AWS Elastic Beanstalk](https://aws.amazon.com/tr/elasticbeanstalk/)
- [AWS Elasticache](https://aws.amazon.com/tr/elasticache/)
- [AWS RDS](https://aws.amazon.com/rds/)
- [AWS S3](https://aws.amazon.com/s3/)

### Backend Technologies
- [Python Django](https://www.djangoproject.com/)
- [Redis](https://redis.io/)
- [MySQL](https://www.mysql.com/)
- [Graphene (GraphQL)](https://graphene-python.org/)
- [Cython](https://cython.org/)
- [Numpy](https://numpy.org/)
- Elasticsearch

### Frontend Technologies
- [React](https://reactjs.org)
- [Apollo GraphQL](https://www.apollographql.com/docs/react/)
- Styled Components
- CKEditor

## Project Structure
```
pixly-app/
├── algorithm/      # Recommendation engine & Cython optimizations
├── djaws/         # Core Django configuration
├── gql/           # GraphQL API implementation
├── items/         # Content management models
├── persona/       # User recommendation system
├── persons/       # User management & profiles
├── blog/          # Blog functionality
├── rss/           # RSS feed functionality
└── _FRONTEND/     # React application
```

---

Contact Details: [cbsofyalioglu@gmail.com](mailto:cbsofyalioglu@gmail.com)

## Python Modules Documentation

### Core Modules

#### `manage.py`
- Django's command-line utility for administrative tasks
- Configures Django environment with 'djaws.settings'
- Entry point for running development server and migrations

#### `djaws/`
- **`settings.py`**: Core Django configuration with AWS integration
- **`urls.py`**: Main URL routing configuration
- **`wsgi.py`**: WSGI application entry point
- **`cognito.py`**: AWS Cognito integration for authentication
- **`storage_backends.py`**: AWS S3 storage configuration
- **`common_views.py`**: Shared view functionality

### Feature Modules

#### `algorithm/`
- **`models.py`**: Database models for algorithm data
- **`custom_functions.py`**: Custom algorithmic implementations
- **`statistics.py`**: Statistical analysis functions
- **`movielens.py`**: MovieLens dataset integration
- **`cython/`**: Performance-optimized Cython implementations
  - `calculations.pyx`: Core computational functions
  - `setup.py`: Cython build configuration

#### `persona/`
- **`models.py`**: User persona and preference models
- **`myqueue.py`**: Queue management for recommendations
- **`profile.py`**: User profile functionality
- **`views.py`**: Persona-related view logic

#### `persons/`
- **`models.py`**: User and authentication models
- **`profile.py`**: Extended profile functionality
- **`abstract.py`**: Abstract base classes
- **`views.py`**: User management views

#### `items/`
- **`models.py`**: Content and media models
- **`tmdb.py`**: TMDB API integration
- **`forms.py`**: Form definitions
- **`views.py`**: Content management views
- **`outerApi.py`**: External API integrations

#### `gql/`
- **`schema.py`**: GraphQL schema definition
- **`types.py`**: GraphQL type definitions
- **`mutations.py`**: GraphQL mutations
- **`search.py`**: Search functionality
- **`tmdb_class.py`**: TMDB data integration
- **`elasticsearch_client.py`**: Elasticsearch integration
- **`social/`**: Social media integrations
  - `social.py`: Base social functionality
  - `facebook.py`: Facebook integration
  - `twitter.py`: Twitter integration

#### `blog/`
- **`models.py`**: Blog content models
- **`views.py`**: Blog rendering views
- **`urls.py`**: Blog URL routing
- **`sitemaps.py`**: SEO sitemap generation

#### `rss/`
- **`models.py`**: RSS feed models
- **`views.py`**: Feed generation views

### Utility Modules

#### `pixly/`
- **`lib.py`**: Common utility functions
- **`cache_functions.py`**: Caching implementations
- **`indexing.py`**: Search indexing functionality
- **`google_index_search.py`**: Google search integration
