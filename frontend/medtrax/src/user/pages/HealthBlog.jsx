import { useState } from 'react';
import '../css/HealthBlog.css';
import SectionHeading from '../components/SectionHeading';

const HealthBlog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const healthBlogs = [
    {
      id: 1,
      title: '5 Simple Exercises for Better Posture',
      excerpt: 'Improve your posture with these easy daily exercises that can be done anywhere...',
      content: 'Maintaining good posture is essential for overall health. Here are five simple exercises you can do daily: 1) Chin tucks - gently pull your head back to align with your spine. 2) Shoulder blade squeezes - bring your shoulder blades together. 3) Wall angels - stand against a wall and move your arms up and down. 4) Planks - strengthen your core muscles. 5) Cat-cow stretches - improve spinal flexibility. Perform each exercise for 30 seconds, repeating 3-5 times daily.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      category: 'Fitness'
    },
    {
      id: 2,
      title: 'The Benefits of Drinking Enough Water',
      excerpt: 'Discover why hydration is crucial for your body and mind...',
      content: 'Water is essential for nearly every bodily function. Benefits include: improved brain function and mood, better temperature regulation, joint lubrication, toxin removal, and digestive health. The general recommendation is 8-10 glasses daily, but needs vary based on activity level and climate. Signs of dehydration include fatigue, headaches, and dark urine. Try carrying a reusable water bottle and flavoring water with fruits to increase intake.',
      image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7',
      category: 'Nutrition'
    },
    {
      id: 3,
      title: 'Understanding Sleep Cycles for Better Rest',
      excerpt: 'Learn how sleep cycles work and how to optimize your sleep...',
      content: 'Sleep occurs in cycles of about 90 minutes each, consisting of REM (rapid eye movement) and non-REM stages. Adults typically need 4-6 complete cycles (6-9 hours) per night. Tips for better sleep: maintain a consistent schedule, create a dark/cool bedroom environment, limit screen time before bed, avoid caffeine in the afternoon, and establish a relaxing pre-sleep routine. Quality sleep improves memory, immune function, and emotional regulation.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
      category: 'Wellness'
    },
    {
      id: 4,
      title: 'Healthy Meal Prep Ideas for Busy Weekdays',
      excerpt: 'Save time and eat healthy with these simple meal prep strategies...',
      content: 'Meal prepping helps maintain healthy eating habits when time is limited. Start with: 1) Planning meals for the week and making a shopping list. 2) Batch cooking staples like grains, proteins, and roasted vegetables. 3) Using versatile ingredients in multiple meals. 4) Proper storage in portioned containers. Easy ideas include overnight oats, grain bowls, stir-fry kits, and soup portions. Invest in quality containers and dedicate 2-3 hours weekly for prep.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      category: 'Nutrition'
    },
    {
      id: 5,
      title: 'Managing Stress Through Mindfulness',
      excerpt: 'Simple mindfulness techniques to reduce daily stress...',
      content: 'Mindfulness involves being fully present in the moment without judgment. Techniques include: 1) Focused breathing - concentrate on inhales/exhales. 2) Body scans - mentally check in with each body part. 3) Mindful walking - pay attention to each step. 4) Observing thoughts - acknowledge them without reaction. Even 5-10 minutes daily can lower cortisol levels, improve focus, and increase emotional resilience. Try using apps or guided sessions to start.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      category: 'Mental Health'
    },
    {
      id: 6,
      title: 'The Importance of Regular Health Check-ups',
      excerpt: 'Why preventive healthcare should be part of your routine...',
      content: 'Regular check-ups can detect health issues early when they are most treatable. Adults should have: annual physical exams, blood pressure checks every 2 years, cholesterol screening every 4-6 years, and age-appropriate cancer screenings. Dental cleanings every 6 months and eye exams every 2 years are also important. Keep a health journal to track symptoms and questions for your doctor. Preventive care saves money and lives in the long run.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
      category: 'Preventive Care'
    }
  ];

  const filteredBlogs = healthBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
      <SectionHeading title="Latest Health Blogs"
        subTitle="Stay updated with expert tips, wellness trends, and everyday health hacks to elevate your well-being." />
      </div>


      <div className="blog-content-section">
        <h2 className="blog-section-title">Featured Health Articles</h2>
        
        {filteredBlogs.length > 0 ? (
          <div className="blog-grid">
            {filteredBlogs.map(blog => (
              <div key={blog.id} className="blog-card" onClick={() => openBlogModal(blog)}>
                <div 
                  className="blog-image" 
                  style={{ backgroundImage: `url(${blog.image})` }}
                ></div>
                <div className="blog-info">
                  <span className="blog-category">{blog.category}</span>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <button className="blog-read-more">Read Article</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="blog-no-results">
            No articles found matching your search.
          </div>
        )}
      </div>

      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={closeBlogModal}>
          <div className="blog-modal-content" onClick={e => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={closeBlogModal}>×</button>
            <div 
              className="blog-modal-image"
              style={{ backgroundImage: `url(${selectedBlog.image})` }}
            ></div>
            <div className="blog-modal-body">
              <span className="blog-modal-category">{selectedBlog.category}</span>
              <h2 className="blog-modal-title">{selectedBlog.title}</h2>
              <div className="blog-modal-text">
                {selectedBlog.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthBlog;