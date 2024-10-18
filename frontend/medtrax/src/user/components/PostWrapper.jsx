import React from 'react';
import SectionHeading from './SectionHeading';
import Post from './Post';

const PostWrapper = ({ data }) => {
  const post = data.slice(0, 3);
  return (
    <section id="blog">
      <div className="st-height-b120 st-height-lg-b80" />
      <SectionHeading title="Latest News"
        subTitle="Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br> Lorem Ipsum the industry's standard dummy text." />
      <div className="container">
        <div className="row">
          {
            post.map((element, index) => (
              <Post {...element} key={index} />
            ))
          }
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  )
}

export default PostWrapper;
