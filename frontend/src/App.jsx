import React from 'react'
import { Router, Route, Switch } from 'wouter'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ResetPasswordPage from './pages/ResetPwdPage.jsx'
import PrivateRoute from './components/private-route.jsx';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Switch>
          <Route path="/" component={AuthPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/dashboard" component={() => <PrivateRoute component={Dashboard} />} />
          <Route path="/reset-password" component={ResetPasswordPage} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-gray-400">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App