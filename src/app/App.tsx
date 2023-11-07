import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ExchangePage } from 'pages/Exchange';

const router = createBrowserRouter([
  {
    index: true,
    element: <ExchangePage />
  }
])

const App = () => {

  return (
    <div className={`app theme-light`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App
