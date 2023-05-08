import './ProgressBar.css'

const ProgressBar = (props) => {
  let {
    size = 200,
    progress = 0,
    trackWidth = 20,
    trackColor = `#ddd`,
    indicatorWidth = 10,
    indicatorColor = `#5C1A81`,
    indicatorCap = `round`,
    label = `Stage...`,
    labelColor = `#333`,
    spinnerMode = false,
    spinnerSpeed = 1
  } = props

  const center = size / 2,
        radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
        dashArray = 2 * Math.PI * radius,
        dashOffset = dashArray * ((100 - progress) / 100)

  let hideLabel = (size < 100 || !label.length || spinnerMode) ? true : false

  return (
    <>
      <div
        className="svg-pi-wrapper"
        style={{ width: size, height: size }}
      >
        <svg
          className="svg-pi" 
          style={{ width: size, height: size }}
        >
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${
              spinnerMode ? "svg-pi-indicator--spinner" : ""
            }`}
            style={{ animationDuration: spinnerSpeed * 1000 }}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>

        {!hideLabel && (
          <div 
            className="svg-pi-label" 
            style={{ color: labelColor }}
          >
            <span className="svg-pi-label__loading">
              {label}
            </span>

            {!spinnerMode && (
              <span className="svg-pi-label__progress">
                {`${
                  progress > 100 ? 5 : Math.round(progress/20)
                } / 5`}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProgressBar
