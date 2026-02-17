import Home from "./pages/home.jsx"
import './App.css'

function App() {
  return(
    <Layout>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/watch/:id" element={<Watch/>}/>
        <Route path = "/upload" element={<Upload/>}/>
        <Route path = "/profile" element={<Profile/>}/>
        <Route path = "/search" element={<Search/>}/>
      </Routes>
    </Layout>
  )
}

export default App
