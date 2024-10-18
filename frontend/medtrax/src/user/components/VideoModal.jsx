
const VideoModal = ({ isTrue, iframeSrc, handelClose }) => {
  return (
    <div className={`st-video-popup ${isTrue === true ? "active" : ""}`}>
      <div className="st-video-popup-overlay"></div>
      <div className="st-video-popup-content">
        <div className="st-video-popup-layer"></div>
        <div className="st-video-popup-container">
          <div className="st-video-popup-align">
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="Embedded Content" className="embed-responsive-item" src={iframeSrc} />
            </div>
          </div>
          <div className="st-video-popup-close" onClick={handelClose}></div>
        </div>
      </div>
    </div>
  )
}

export default VideoModal;
