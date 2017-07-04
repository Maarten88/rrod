import * as React from 'react';
import * as Scroll from 'react-scroll';
import ScrollEffect from '../lib/scroll-effect';
import Fullscreen from '../lib/fullscreen';
import Footer from './Footer';

export default class Home extends React.Component<{}> {
    public render() {
          return <div className="container-fluid">
            <Fullscreen>
                <div className="row" id="hero">
                    <div className="container">
                        <div id="tagline">
                            <ScrollEffect animate="bounceIn">
                                <h1 className="home-intro-text">Demo!</h1>
                                <h1 className="home-intro-text">...React, Redux, Orleans and Dotnet</h1>
                                    <h3 className="home-intro-text">Introducing the <Scroll.Link to="demo" href="#" smooth={true} duration={700} offset={-50}>RROD</Scroll.Link> stack</h3>
                            </ScrollEffect>
                        </div>

                        <div className="down-link">
                            <Scroll.Link to="demo" href="#" className="icon-link" smooth={true} duration={700} offset={-50} ><i className="fa fa-arrow-circle-down custom" ></i></Scroll.Link>
                        </div>
                    </div>
                </div>
            </Fullscreen>
            <Scroll.Element name="demo" />
            <div className="row" id="footer">
                <Footer />
            </div>
        </div>;
    }
}
