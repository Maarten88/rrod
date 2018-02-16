import * as React from 'react';

import * as Scroll from 'react-scroll';
import ScrollEffect from '../lib/scroll-effect';
import Fullscreen from '../lib/fullscreen';
import Footer from './Footer';
import { HeadTag } from '../lib/react-head';

export default class Home extends React.Component<{}> {
    public render() {
        return <div className="container-fluid">
            <HeadTag key="title" tag="title">RROD - React, Redux, Orleans and Dotnet Demo</HeadTag>
            <HeadTag key="meta:description" tag="meta" name="description" content="An exploration into modern web architecture with Dotnet Core, Javascript, and a backend that implements Event Sourcing using the Actor model" />
            <Scroll.Element name="top" />
            <Fullscreen>
                <div className="row" id="hero">
                    <div className="container">
                        <div id="tagline">
                            <ScrollEffect animate="bounceIn">
                                <h1 className="home-intro-text">Demo!</h1>
                                <h1 className="home-intro-text">...React, Redux, Orleans and Dotnet</h1>
                                    <h3 className="home-intro-text">Introducing the <Scroll.Link to="demo" href="#" smooth={true} duration={700} offset={0}>RROD</Scroll.Link> stack</h3>
                            </ScrollEffect>
                        </div>

                        <div className="down-link">
                            <Scroll.Link to="demo" href="#" className="icon-link" smooth={true} duration={700} offset={0} ><i className="fa fa-arrow-circle-down custom" ></i></Scroll.Link>
                        </div>
                    </div>
                </div>
            </Fullscreen>
            <Scroll.Element name="demo" />
            <Fullscreen>
                <div className="row" id="demo">
                    <div className="container">
                        <h1>Page 2</h1>
                        <div className="down-link">
                            <Scroll.Link to="footer" href="#" className="icon-link" smooth={true} duration={700} offset={0} ><i className="fa fa-arrow-circle-down custom" ></i></Scroll.Link>
                        </div>
                    </div>
                </div>
            </Fullscreen>
            <Scroll.Element name="footer" />
            <div className="row" id="footer">
                <Footer />
            </div>
        </div>;
    }
}
