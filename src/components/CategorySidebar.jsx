import './CategorySidebar.css'

const CategorySidebar = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <div className="category-sidebar">
      {/* <div className="sidebar-header">
        <h3>Categories</h3>
      </div> */}
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              className={`category-link ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryClick(category.id)}
            >
              {category.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategorySidebar

