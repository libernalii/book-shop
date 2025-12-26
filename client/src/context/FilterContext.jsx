import { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setSortBy('');
    setPage(1);
  };

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        sortBy,
        setSortBy,
        page,
        setPage,
        resetPage,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilter must be used inside FilterProvider');
  }
  return ctx;
};
