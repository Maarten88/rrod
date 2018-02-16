import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import buildSelector from './buildSelector';

    interface HeadTagProps {
        tag?: string;
    }

export default class HeadTag extends React.Component<HeadTagProps & (React.MetaHTMLAttributes<{}> | React.LinkHTMLAttributes<{}> | React.HTMLAttributes<HTMLTitleElement>)> {
        static contextTypes = {
            reactHeadTags: PropTypes.object,
        };

        static propTypes = {
            tag: PropTypes.string,
        };

        static defaultProps = {
            tag: 'meta',
        };

        state = {
            canUseDOM: false,
        };

        componentDidMount() {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({ canUseDOM: true });

            const { tag, children, ...rest } = this.props; // eslint-disable-line react/prop-types
            const ssrTags = document.head.querySelector(`${tag}${buildSelector(rest)}[data-ssr=""]`);

            /* istanbul ignore else */
            if (ssrTags) {
                ssrTags.parentElement.removeChild(ssrTags);
            }
        }

        render() {
            const { tag: Tag, ...rest } = this.props;
            const key = `${Tag}${Object.keys(rest).filter(key => key !== "content" && key !== "children").join(':')}`;
            // console.log("key", key);

            if (this.state.canUseDOM) {
                const Comp = <Tag key={key} { ...rest} />;
                return ReactDOM.createPortal(Comp, document.head);
            }

            // on client we don't require HeadCollector
            if (this.context.reactHeadTags) {
                const ServerComp = <Tag data-ssr="" key={key} {...rest} />;
                this.context.reactHeadTags.add(ServerComp);
            }

            return null;
        }
    }
