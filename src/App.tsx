import React, { useState} from 'react';
import MainPage from './components/MainPage';
import SearchPage from './components/SearchPage';
import './index.css';

const App: React.FC = () => {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="App">
            <header className="header">
                <div className="player">
                  <button className="track-cover"></button>

                  <button className="track-title"></button>

                  <button className="rewind-track-toggle inverted"></button>

                  <button className="play-track-toggle"></button>

                  <button className="rewind-track-toggle"></button>

                  <button className="heart"></button>
                </div>

                <a className="logo" href="index.html">
                  <img className="logo-img" src="images/logo.png" alt=""></img>
                </a>

                <div className="navbar">
                  <button
                    className={`search-toggle ${showSearch ? 'active' : ''}`}
                    onClick={() => setShowSearch(!showSearch)}
                    ></button>

                  <div className="nav-list">
                    <a className="nav-link" href="/">Home</a>
                    <a className="nav-link" href="/">Live</a>
                    <a className="nav-link" href="/">Music</a>
                    <a className="nav-link" href="/">Charts</a>
                    <a className="nav-link" href="/">Events</a>
                    <a className="nav-link" href="/">Features</a>
                  </div>

                  <a className="profile-photo" href="/"> </a>
                </div>
            </header>

            <main>
                {showSearch ?
                    (<SearchPage onClose={() => setShowSearch(false)} />)
                        : (<MainPage />)
                }
            </main>

            <footer>
                <div className="footer">
                    <ul className="links">
                        <li className="group-links">
                          <h5 className="links-info">COMPANY</h5>
                          <a className="link" href="/">About Last.fm</a>
                          <a className="link" href="/">Contact us</a>
                          <a className="link" href="/">Jobs</a>
                        </li>
                        <li className="group-links">
                          <h5 className="links-info">HELP</h5>
                          <a className="link" href="/">Track My Music</a>
                          <a className="link" href="/">Community Support</a>
                          <a className="link" href="/">Community Guidelines</a>
                          <a className="link" href="/">Help</a>
                        </li>
                        <li className="group-links">
                          <h5 className="links-info">GOODIES</h5>
                          <a className="link" href="/">Download Scrobbler</a>
                          <a className="link" href="/">Developer API</a>
                          <a className="link" href="/">Free Music Downloads</a>
                          <a className="link" href="/">Merchandise</a>
                        </li>
                        <li className="group-links">
                          <h5 className="links-info">ACCOUNT</h5>
                          <a className="link" href="/">Inbox</a>
                          <a className="link" href="/">Settings</a>
                          <a className="link" href="/">Last.fm Pro</a>
                          <a className="link" href="/">Logout</a>
                        </li>
                        <li className="group-links">
                          <h5 className="links-info">FOLLOW US</h5>
                          <a className="link" href="/">Facebook</a>
                          <a className="link" href="/">Twitter</a>
                          <a className="link" href="/">Instagram</a>
                          <a className="link" href="/">YouTube</a>
                        </li>
                    </ul>
                </div>

                <div className="line-footer"></div>

                <div className="footer footer-flex">
                  <div>
                    <div className="languages">
                      <button className="language white">English</button>
                      <button className="language">Deutsch</button>
                      <button className="language">Español</button>
                      <button className="language">Français</button>
                      <button className="language">Italiano</button>
                      <button className="language">日本語</button>
                      <button className="language">Polski</button>
                      <button className="language">Português</button>
                      <button className="language">Русский</button>
                      <button className="language">Svenska</button>
                      <button className="language">Türkçe</button>
                      <button className="language">简体中文</button>
                    </div>

                    <p className="time-zone">Time zone: <span className="white">Europe/Moscow</span></p>

                    <p className="rights">
                      CBS Interactive © 2022 Last.fm Ltd. All rights reserved · Terms of Use · Privacy Policy · Legal Policies · Cookies Policy · Do Not Sell My Personal Information · Jobs at ViacomCBS · Last.fm Music
                    </p>
                  </div>

                  <div className="footer-logo">
                    <p className="footer-logo-1">Audioscrobbler</p>
                    <div className="footer-logo-2"></div>
                  </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
