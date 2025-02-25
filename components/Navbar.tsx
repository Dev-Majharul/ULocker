import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar flex justify-bwtween item-center bg-muted-fogrounded text-background h-16"> 
        <a className="navbar-brand" href="/">
            <img src="" alt="logo" />
        </a>
        
        
        <ul className='flex item-center justify-between space-x-4'>
            <li>
            <a href="/">Home</a>
            </li>
            <li>
            <a href="/about">About</a>
            </li>
            <li>
            <a href="/contact">Contact</a>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar