import * as React from 'react';
import * as PropTypes from 'prop-types';

export interface HeadCollectorProps {
    headTags: React.ReactElement<any>[];
    children: React.ReactNode;
}


export default class HeadCollector extends React.Component<HeadCollectorProps> {
    static propTypes = {
        headTags: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
        children: PropTypes.node.isRequired,
    };

    static childContextTypes = {
        reactHeadTags: PropTypes.object,
    };

    getChildContext() {
        return {
            reactHeadTags: {
                add: (c: React.ReactElement<any>) => this.props.headTags.push(c)
            },
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
