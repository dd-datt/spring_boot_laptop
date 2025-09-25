import React, {useContext, useEffect, useState} from "react";

import { USER_LOGIN } from "../../Utils/Setting/Config";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import FeaturedCategories from "./FeaturedCategories";
import ProductSections from "./ProductSections";
import Features from "./Features";
import HeroSection from "./HeroSection";
import TestimonialsNewsletter from "./TestimonialsNewsletter";
import NavigationHeader from "./Navigation";
import ChatBox from "./SupportChat";
import khImg from '../../assets/kh.jpg'; // Điều chỉnh đường dẫn nếu cần
import "../style/HomeScreen.css";
import {NotificationContext} from "../../components/NotificationProvider";
const HomeScreen = () => {
    const { isAuthenticated } = useSelector((state) => state.UserReducer);
    const [userRole, setUserRole] = useState("");
    const [showChatBox, setShowChatBox] = useState(false);
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('USER_LOGIN');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const notification = useContext(NotificationContext);
    useEffect(() => {
        if (isAuthenticated) {
            const userDetails = JSON.parse(localStorage.getItem(USER_LOGIN));
            if (userDetails && userDetails.role) {
                setUserRole(userDetails.role.name);
            }
        }
    }, [isAuthenticated]);

    const toggleChatBox = () => {
        if (userData === null) {
            notification.warning({
                message: 'Thông báo',
                description: 'Đăng nhập để được hỗ trợ!',
                placement: 'topRight',
            });
            return;
        }
        setShowChatBox(!showChatBox);
    };


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-screen-container">
            <HeroSection></HeroSection>
            <ProductSections></ProductSections>
            <TestimonialsNewsletter></TestimonialsNewsletter>
            <Features></Features>
            <div className="chat-icon" onClick={toggleChatBox}>
                <img src={khImg} alt="Chat Icon"/>
            </div>
            <ChatBox  showChatBox={showChatBox} toggleChatBox={toggleChatBox}/>
        </div>
    );
};

export default HomeScreen;
