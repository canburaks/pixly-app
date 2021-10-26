# Pixly: AI-assisted Movie Recommendation Engine

Pixly is a deprecated movie recommendation engine that uses [MovieLens data](https://grouplens.org/datasets/movielens/). 
It was a learning project that opened the doors of the full-stack web development world to me. 

The basic idea relies on collaborative filtering for film recommendations. TMDB and MovieLens data are used for user-similarity computations. Roughly 40.000 people who had voted for more than 20 movies in Movielens were randomly selected. When a new user votes for 20 films, people from the database with similar cinema tastes (highly correlated people) are found. These highly similar people were assigned to this new user in less than a minute. Afterward, a score prediction for a movie not seen yet (on average  +/- 0.5 points) is computed for the user when a new film page is visited. Also, various dimensionality reduction techniques are researched and used for clustering the movies. 

Pixly had a Django backend. It has worked with Numpy and Cython to optimize multi-threaded intensive computations. It used MySQL as a database with Redis support. 

I used React with some statically generated web pages on the frontend part. I built an atomic design system with CSS and the styled-components for the project.  Also, rich data for movies and people implemented for SEO purposes. 

## Tech Stack
Pixly is a web app that is built as a single-page application. I implemented a Django backend, Numpy and Cython optimized multi-threaded intensive calculations, and MySQL with Redis supported databases. I used React with some statically generated web pages on the frontend part. I built an atomic design system with CSS and the styled-components for the project.  Also, rich data for movies and people implemented for SEO purposes. 
Also, [Pixly Blog is implemented with Svelte](https://github.com/canburaks/pixly-blog-svelte). 

### Cloud
- [AWS Elastic Beanstalk](https://aws.amazon.com/tr/elasticbeanstalk/)
- [AWS Elasticache](https://aws.amazon.com/tr/elasticache/)
- [AWS RDS](https://aws.amazon.com/rds/)
- [AWS S3](https://aws.amazon.com/s3/)

### Back-end
- [Python Django](https://www.djangoproject.com/)
- [Redis](https://redis.io/)
- [MySQL](https://www.mysql.com/)
- [Graphene (GraphQL)](https://graphene-python.org/)
- [Cython](https://cython.org/)
- [Numpy](https://numpy.org/)

### Front-end
- [React](https://reactjs.org)
- [Apollo GraphQL](https://www.apollographql.com/docs/react/)



Contact Details: [cbsofyalioglu@gmail.com](mailto:cbsofyalioglu@gmail.com)
