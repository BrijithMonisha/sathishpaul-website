import './MonthSidebar.css'

const MonthSidebar = ({ months, activeMonth, onMonthClick, language = 'english' }) => {
  return (
    <div className="month-sidebar">
      <ul className="month-list">
        {months.map((month) => (
          <li key={month.key}>
            <button
              className={`month-link ${activeMonth === month.key ? 'active' : ''}`}
              onClick={() => onMonthClick(month.key)}
            >
              {language === 'tamil' && month.tamil ? month.tamil : month.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MonthSidebar

