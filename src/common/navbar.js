import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import '../css/CustomNavbar.css'
import classNames from 'classnames'

function CommonNavbar() {

    const [expanded, setExpanded] = useState(false);
    const [scrolled, setScrolled] = useState()
    const classes = classNames('custom-nav', {
        scrolled: scrolled,
    })

    useEffect(_ => {
        const handleScroll = _ => {
            if (window.pageYOffset > 1) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return _ => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <Navbar expand="lg" variant="dark" bg="red"
            // className="custom-nav"
            fixed="top"
            className={classes}
            expanded={expanded}
        >

            < Navbar.Brand href="/" > The Vijay Soni</Navbar.Brand >
            <Navbar.Toggle aria-controls="basic-navbar-nav dark" onClick={() => setExpanded(expanded ? false : "expanded")} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                </Nav>
                <Nav className="justify-content-end" activeKey="/home" >
                    <Nav.Item className="nav-bar-item" >
                        <Nav.Link href="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-bar-item">
                        <Nav.Link onClick={() => setExpanded(false)} href="#aboutme">About Me</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-bar-item">
                        <Nav.Link onClick={() => setExpanded(false)} href="#projects">Projects</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="nav-bar-item">
                        <Nav.Link onClick={() => setExpanded(false)} href="#contactme">Contact Me</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
}

export default CommonNavbar;
