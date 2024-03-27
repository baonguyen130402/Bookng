import axios from "axios";
import "./App.css";
import IndexPage from "./pages/IndexPage";

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

function App() {
  return <IndexPage />;
}

export default App;
