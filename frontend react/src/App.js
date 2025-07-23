import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import TailwindTest from './components/TailwindTest';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <img src={logo} className="mx-auto h-16 w-16 animate-spin" alt="logo" />
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                React App with Tailwind CSS
              </h1>
              <p className="mt-2 text-gray-600">
                Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/App.js</code> and save to reload.
              </p>
              <div className="mt-6">
                <a
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </div>
              <p className="mt-4 text-sm text-green-600">
                ✓ Tailwind CSS configured<br/>
                ✓ Axios installed ({axios.VERSION})
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tailwind Test Component */}
      <TailwindTest />
    </div>
  );
}

export default App;
