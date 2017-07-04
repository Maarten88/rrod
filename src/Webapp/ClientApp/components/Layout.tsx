import * as React from 'react';
import NavMenu from './NavMenu';
import RouteTransition from '../lib/route-transition';

export interface LayoutProps {
    body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps> {

    public render() {
        return <div>
            <NavMenu />
            <RouteTransition pathname={typeof window !== 'undefined' ? window.location.pathname : '' } >
                 { this.props.body /* current route component */ }
            </RouteTransition>
        </div>;
    }
}

// const styles: any = {}

// styles.fill = {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0
// };

// styles.content = Object.assign({},
//     styles.fill, {
//         top: '50px',
//         textAlign: 'center'
//     }
// );
