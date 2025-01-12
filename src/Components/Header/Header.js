import React from 'react'
import { Nav, NavItem, Navbar, NavbarBrand } from 'reactstrap';
import "./Header.css";
import Logo from '../../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        token: state.token,
    }
}

const Header = props => {
    let links = null;
    if (props.token === null) {
        links = (<Nav className='me-md-5'>
            <NavItem>
                <NavLink to='/login' className='NavLink'>Login</NavLink>
            </NavItem>
        </Nav>)
    } else {
        links = (<Nav className='me-md-5'>
            <NavItem>
                <NavLink to='/' className='NavLink'>Burger Builder</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to='/orders' className='NavLink'>Orders</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to='/logout' className='NavLink'>Logout</NavLink>
            </NavItem>
        </Nav>)
    }
    return (
        <div className="Navigation">
            <Navbar style={{ backgroundColor: "#D70f64", height: "70px" }}>
                <NavbarBrand href='/' className='me-auto ml-md-5 Brand' ><img src={Logo} alt="Logo" width="80px" /></NavbarBrand>
                {links}
            </Navbar>
        </div>
    )
}

export default connect(mapStateToProps)(Header);