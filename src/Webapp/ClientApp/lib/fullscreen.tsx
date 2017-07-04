import * as React from 'react';


interface Dimensions {
    height: string
}

var getDimensions = () => ({ height: window.innerHeight - 50 + 'px' });

export default class FullScreen extends React.Component<{}, Dimensions> {
    constructor(props) {
        super(props);
        this.state = { height: '100vh' };
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        this.setState(getDimensions());
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const child = React.cloneElement(React.Children.only(this.props.children), { style: { height: this.state.height } });
        //return <div>{child}</div>;
        return child
    }

}