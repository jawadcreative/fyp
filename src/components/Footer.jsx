import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
    return (
        <footer className='flex items-center justify-between px-6 py-3 w-full'>
            <Link to={'/'} className="flex items-center gap-2">
                <img src="/icons/logo.svg" alt="logo" />
                <p className="font-extrabold text-xl">Tourvisto</p>
            </Link>
            <div className="flex gap-6 items-center">
                {['Terms & Condition', 'Privacy & Policy'].map((item, i) => (
                    <Link to={`/${item.toLocaleLowerCase().replaceAll(' ', '')}`} key={i}>{item}</Link>
                ))}
            </div>
        </footer>
    )
}

export default Footer