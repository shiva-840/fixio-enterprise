import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-logo">
        Fixio<span className="loader-dot"></span>
      </div>

      <div className="loader-bar">
        <div className="loader-fill"></div>
      </div>
    </div>
  );
};

export default Loader;