import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('prepmate_theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: savedTheme },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('prepmate_theme', state.mode);
      if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.background = '#0a0a14';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.background = '#f0f4ff';
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
