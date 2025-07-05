const ImageBlock = ({ data }) => {
  return (
    <div className="st-video-block st-style1 st-zoom">
      <div className="st-video-block-img st-zoom-in st-dynamic-bg" style={{ backgroundImage: `url(${data.imageSrc})` }} />
    </div>
  )
}

export default ImageBlock;
