import * as React from 'react';
import NavMenu from './NavMenu';


const Layout = ({children}) => 
    <section>
        <NavMenu />
        {children}
    </section>

export default Layout;