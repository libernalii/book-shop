import { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setPriceRange([0, 1000]);
  };

  return (
    <FilterContext.Provider value={{ searchTerm, setSearchTerm, category, setCategory, priceRange, setPriceRange, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
