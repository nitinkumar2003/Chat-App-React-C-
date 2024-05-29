import React,{useState} from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
  const [user , setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };
  return (
    <div className="App">
      
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat user={user} />
    )}
    </div>
    </div>

  )
}

export default App;