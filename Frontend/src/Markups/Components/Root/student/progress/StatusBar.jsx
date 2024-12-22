
import PropTypes from "prop-types"; // Import PropTypes
import "./progress.css";

const StatusBar = ({ progress }) => {
  const getProgressBarColor = (progress) => {
    // Calculate the color based on progress value
    const red = 255 - Math.round((progress / 100) * 255);
    const green = Math.round((progress / 100) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="status_bar">
      <div
        className="status_bar_inner"
        style={{
          width: `${progress}%`,
          backgroundColor: getProgressBarColor(progress),
        }}
      >
        <span className="status_bar_text">{progress}%</span>
      </div>
    </div>
  );
};

// Define prop types for StatusBar component
StatusBar.propTypes = {
  progress: PropTypes.number.isRequired, // Progress prop is required and must be a number
};

export default StatusBar;
