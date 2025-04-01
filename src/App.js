import { useState } from "react";
import Books from "./components/Books/Books";
import Home from "./components/Home/Home"
function App() {
  const [component, setComponent] = useState('')
  const [category,setCategory]=useState(null)
  const [categoryName,setCategoryName]=useState(null)
  switch (component) {
    case 'details':
      return <Books
        setComponent={setComponent}
        category={category}
        categoryName={categoryName}
      />
    default:
     return <Home
        setComponent={setComponent}
        setCategory={setCategory}
        setCategoryName={setCategoryName}
      />
  }
}

export default App;
