import Snackbar from './components/Snackbar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            {/* ... existing routes ... */}
          </Routes>
          <Snackbar />
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App; 