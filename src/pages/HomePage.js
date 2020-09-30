import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/home.css'
import { Image, Row, Col, Card, Button } from 'react-bootstrap'
import {
    IMAGE_VIJAY,
    FB, INSTA, TWITTER, WHATSAPP, LINKEDIN, APP_DEV, WEB_DEV, DEV
} from '../utils/imageRes';
import FlatList from 'flatlist-react';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import Firebase from '../firebase/firebase'
import Lottie from 'react-lottie'
import Loader from '../images/loader.json'
import { RemoveScrollBar } from 'react-remove-scroll-bar';

function HomePage() {

    const [myData, setMyData] = useState(undefined)
    const [myProjects, setMyProjects] = useState(undefined)

    function renderProjects(item, index) {
        return (
            <Fade cascade>
                <div className="projectCardBody">
                    <Card style={{ height: '100%', marginLeft: 5, marginRight: 5, }} className="projectCard">
                        <div>
                            <Card.Img variant="top" className="projectImage" src={item.image} alt={item.name} />
                        </div>
                        <Card.Body className="cardBody">
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{item.platform}</Card.Subtitle>
                            <Card.Text>{item.about}</Card.Text>
                            {
                                item.android != undefined &&
                                // <Card.Link href={item.android} style={{ color: 'black' }} >Android</Card.Link>
                                <Button variant="outline-dark" size="sm" href={item.android} target="_blank" >Android</Button>
                            }
                            {' '}
                            {
                                item.ios != undefined &&
                                // <Card.Link href={item.android} style={{ color: 'black' }} >Android</Card.Link>
                                <Button variant="outline-dark" size="sm" href={item.ios} target="_blank" >iOS</Button>
                            }
                            {' '}
                            {
                                item.web != undefined &&
                                // <Card.Link href={item.android} style={{ color: 'black' }} >Android</Card.Link>
                                <Button variant="outline-dark" size="sm" href={item.ios} target="_blank" >Website</Button>
                            }
                        </Card.Body>

                    </Card>
                </div>
            </Fade>
        );
    }

    useEffect(() => {

        getData()
        startAnalytics()

    }, [])

    function startAnalytics() {
        Firebase.analytics().logEvent('view')
    }

    function getData() {
        var database = Firebase.database();
        database.ref('/about').once('value', (snapshot) => {
            let data = snapshot.toJSON()
            setMyData(data)
        });

        let myProjects = []
        database.ref('myProjects').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                myProjects.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                })
            });
            setMyProjects(myProjects)
        });
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Loader,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div class="main">
            {
                myProjects === undefined ?
                    <div className="loader">
                        <Lottie options={defaultOptions}
                            height={200}
                            width={200}
                            isStopped={false}
                            isPaused={false}
                        />
                        <div>
                            Loading...
                        </div>
                    </div>
                    :
                    <Fade>
                        <div>
                            <div id='home' className="">
                                <section id="homeFirst" class="homeFirstView homeView" >
                                    <div class="helloWorld" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                                        <h1 className="homeViewFont">Hello World!</h1>
                                    </div>
                                    <a href="#aboutme"><span></span></a>
                                </section>
                            </div>
                            <div>
                                <section id="aboutme" class="homeSecondView" >
                                    <Row className="parallax">
                                        {/* <Col sm></Col> */}
                                        <Col sm>
                                            <Fade left>
                                                <Image src={IMAGE_VIJAY} style={{ height: 200, width: 200 }} roundedCircle fluid alt="Vijay Soni" className="userImage" />
                                                <p className="name">{myData !== undefined ? myData.name : ''}</p>
                                                <p className="designation">{myData !== undefined ? myData.designation : ''}</p>
                                                <p className="company">{myData !== undefined ? myData.company : ''}</p>
                                            </Fade>
                                        </Col>
                                        <Col sm>
                                            <Fade right>
                                                <p className="whoAmI">Who Am I?</p>
                                                <p className="aboutFont">
                                                    {myData !== undefined ? myData.about : ''}
                                                </p>
                                            </Fade>
                                        </Col>
                                        {/* <Col sm></Col> */}
                                    </Row>
                                </section>
                            </div>
                            <div>
                                <section id="myskills" class="skillsView" >
                                    <p className="skillTitle">What Can I Do?</p>
                                    <Row className="parallax">
                                        {/* <Col sm></Col> */}
                                        <Col sm className='iconView'>
                                            <Bounce>
                                                <Image src={APP_DEV} fluid alt="Vijay Soni" className="skillsIcon" />
                                                <p className="skillName">APP Design</p>
                                            </Bounce>
                                        </Col>
                                        <Col sm className='iconView'>
                                            <Bounce>
                                                <Image src={WEB_DEV} fluid alt="Vijay Soni" className="skillsIcon" />
                                                <p className="skillName">Web Design</p>
                                            </Bounce>
                                        </Col>
                                        <Col sm className='iconView'>
                                            <Bounce>
                                                <Image src={DEV} fluid alt="Vijay Soni" className="skillsIcon" />
                                                <p className="skillName">Developement</p>
                                            </Bounce>
                                        </Col>

                                    </Row>
                                </section>
                            </div>
                            <div>
                                <section id="projects" class="homeThirdView" >
                                    <p className="projectFont">My Projects</p>
                                    <div style={{ marginBottom: '30px' }}>
                                        {
                                            myProjects !== undefined &&
                                            <FlatList
                                                list={myProjects}
                                                renderItem={renderProjects}
                                                displayGrid
                                            />
                                        }
                                    </div>
                                </section>
                            </div>
                            <div>
                                <section id="contactme" class="homeFourthView" >
                                    <div className="socialView">
                                        <p className="contactFont">Contact Me</p>
                                        <div>
                                            <a href="https://www.facebook.com/thevijaysoni" target="_blank"> <img className="socialIcon" src={FB} alt="fb" /> </a>
                                            <a href="https://www.instagram.com/thevijaysoni" target="_blank">  <img className="socialIcon" src={INSTA} alt="insta" /></a>
                                            <a href="https://wa.me/9667052731" target="_blank">  <img className="socialIcon" src={WHATSAPP} alt="whatsapp" /></a>
                                            <a href="https://www.twitter.com/thevijaysoni" target="_blank">  <img className="socialIcon" src={TWITTER} alt="twitter" /></a>
                                            <a href="https://www.linkedin.com/in/thevijaysoni" target="_blank"> <img className="socialIcon" src={LINKEDIN} alt="linkedin" /></a>
                                        </div>
                                    </div>
                                    <p className="craftedFont">Crafted By Vijay Soni 	&#10084;</p>
                                </section>
                            </div>
                        </div>
                    </Fade>
            }
        </div>

    );
}


export default HomePage;
