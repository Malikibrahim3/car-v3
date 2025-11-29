// Theme utility functions for consistent styling across light/dark modes

export const getStatusGradient = (status, colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  const gradients = {
    profit: isDark
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.02) 100%)',
    loss: isDark
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.02) 100%)',
    breakeven: isDark
      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)',
  };
  
  return gradients[status] || gradients.breakeven;
};

export const getStatusBorderColor = (status, colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  if (!isDark) {
    // In light mode, use subtle borders for status cards only when needed
    const lightOpacity = '0.2';
    const colors = {
      profit: `rgba(16, 185, 129, ${lightOpacity})`,
      loss: `rgba(239, 68, 68, ${lightOpacity})`,
      breakeven: `rgba(245, 158, 11, ${lightOpacity})`,
    };
    return colors[status] || 'rgb(222, 226, 230)'; // Default Mantine border
  }
  
  // Dark mode borders
  const darkOpacity = '0.5';
  const colors = {
    profit: `rgba(16, 185, 129, ${darkOpacity})`,
    loss: `rgba(239, 68, 68, ${darkOpacity})`,
    breakeven: `rgba(245, 158, 11, ${darkOpacity})`,
  };
  
  return colors[status] || colors.breakeven;
};

export const getAchievementGradient = (color, colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  if (!isDark) {
    // Light mode: very subtle gradients
    const opacity = '0.06';
    const secondOpacity = '0.02';
    
    // Extract RGB from hex color
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${opacity}) 0%, rgba(${r}, ${g}, ${b}, ${secondOpacity}) 100%)`;
  }
  
  // Dark mode: more visible gradients
  const opacity = '0.2';
  const secondOpacity = '0.1';
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${opacity}) 0%, rgba(${r}, ${g}, ${b}, ${secondOpacity}) 100%)`;
};

export const getCardBackground = (colorScheme) => {
  return colorScheme === 'dark' 
    ? 'rgba(26, 27, 30, 0.8)' 
    : 'rgb(255, 255, 255)';
};

export const getDefaultCardStyle = (colorScheme) => {
  return {
    background: getCardBackground(colorScheme),
    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgb(222, 226, 230)',
  };
};

export const getTextColor = (colorScheme, dimmed = false) => {
  if (colorScheme === 'dark') {
    return dimmed ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)';
  }
  return dimmed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.9)';
};
