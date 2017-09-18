import * as React from 'react';
import NavMenu from './NavMenu';

export default class Layout extends React.Component<{}> {
    public render() {
        return <div>
            <NavMenu />
            { this.props.children }
        </div>;
    };
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
