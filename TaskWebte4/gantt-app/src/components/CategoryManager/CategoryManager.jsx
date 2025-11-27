import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import './CategoryManager.css';

const CategoryManager = ({ isOpen, onClose, translations: t }) => {
  const { categories, addCategory, updateCategory, deleteCategory, resetToDefaults } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  // Get category display name (translation or custom name)
  const getCategoryName = (category) => {
    // If category has custom name, use it
    if (category.name) {
      return category.name;
    }
    // Otherwise use translation for default categories
    if (t && t[`category_${category.id}`]) {
      return t[`category_${category.id}`];
    }
    // Fallback to ID
    return category.id;
  };

  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditName(getCategoryName(category));
    setEditColor(category.color);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory(editingId, { name: editName.trim(), color: editColor });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddNew = () => {
    if (newName.trim()) {
      addCategory(newName.trim(), newColor);
      setNewName('');
      setNewColor('#3b82f6');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id) => {
    const success = deleteCategory(id);
    if (!success) {
      alert(t?.cannotDeleteDefault || 'Nemožno odstrániť predvolenú kategóriu.');
    }
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="category-modal__header">
          <h2>{t?.manageCategories || 'Správa kategórií'}</h2>
          <button className="category-modal__close" onClick={onClose}>×</button>
        </div>

        <div className="category-modal__body">
          <div className="category-list">
            {categories.map(category => (
              <div key={category.id} className="category-item">
                {editingId === category.id ? (
                  <>
                    <input
                      type="color"
                      className="category-item__color-input"
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="category-item__name-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button className="category-item__btn category-item__btn--save" onClick={handleSaveEdit}>
                      ✓
                    </button>
                    <button className="category-item__btn category-item__btn--cancel" onClick={handleCancelEdit}>
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="category-item__color"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="category-item__name">{getCategoryName(category)}</span>
                    <button
                      className="category-item__btn category-item__btn--edit"
                      onClick={() => handleStartEdit(category)}
                    >
                      ✎
                    </button>
                    <button
                      className="category-item__btn category-item__btn--delete"
                      onClick={() => handleDelete(category.id)}
                      disabled={['summary', 'task', 'goal'].includes(category.id)}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {isAddingNew ? (
            <div className="category-item category-item--new">
              <input
                type="color"
                className="category-item__color-input"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <input
                type="text"
                className="category-item__name-input"
                placeholder={t?.categoryName || 'Názov kategórie'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddNew();
                  if (e.key === 'Escape') setIsAddingNew(false);
                }}
              />
              <button className="category-item__btn category-item__btn--save" onClick={handleAddNew}>
                ✓
              </button>
              <button className="category-item__btn category-item__btn--cancel" onClick={() => setIsAddingNew(false)}>
                ✕
              </button>
            </div>
          ) : (
            <button className="category-modal__add-btn" onClick={() => setIsAddingNew(true)}>
              + {t?.addCategory || 'Pridať kategóriu'}
            </button>
          )}
        </div>

        <div className="category-modal__footer">
          {showResetConfirm ? (
            <div className="category-modal__reset-confirm">
              <button className="category-modal__confirm-btn" onClick={handleConfirmReset}>
                ✓
              </button>
              <button className="category-modal__cancel-btn" onClick={handleCancelReset}>
                ✕
              </button>
            </div>
          ) : (
            <button className="category-modal__reset-btn" onClick={handleResetClick}>
              {t?.resetToDefaults || 'Obnoviť predvolené'}
            </button>
          )}
          <button className="category-modal__done-btn" onClick={onClose}>
            {t?.done || 'Hotovo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
