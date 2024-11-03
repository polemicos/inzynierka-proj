import { Navlink } from 'react-router-dom'

export default function Navbar() {
    return (
        <div>
            <nav className="flex justify-between items-center mb-6"></nav>
            <Navlink to="/" className="inline-flex items-center mr-4 justify-center whitespace-nowrap text-md font-medium">Home</Navlink>
            <Navlink to="/cars" className="inline-flex items-center mr-4 justify-center whitespace-nowrap text-md font-medium">Cars</Navlink>
            <Navlink to="/info" className="inline-flex items-center mr-4 justify-center whitespace-nowrap text-md font-medium">Info</Navlink>
        </div>)
}