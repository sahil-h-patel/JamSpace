import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider'
import { createBrowserRouter, RouterProvider } from 'react-router' // Both from react-router-dom

// Page Imports
import App from './App'
import Home from './Home' // Assuming you moved these to pages/ per previous advice
import JoinSession from './JoinSession'

// The Session Components
import { SessionProvider } from './context/session'
import { SessionManager } from './components/session/SessionManager'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "join",
        element: <JoinSession/>
      },
      {
        // THIS IS THE KEY CHANGE
        // Instead of separate /host and /player routes, we have one /session route.
        // The SessionManager looks at the Context (Role: 'host' | 'player') 
        // and decides whether to show the Lobby or the Active View.
        path: "session",
        element: <SessionManager/>
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <SessionProvider>
        <RouterProvider router={router}/>
      </SessionProvider>
    </Provider>
  </StrictMode>
)