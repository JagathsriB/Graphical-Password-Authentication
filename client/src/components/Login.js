import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toast, successToast } from "../util/toast";
import { api } from "../static/config";
import { Page } from "../util/config";
import PasswordIcon from "./Items/PasswordIcon";
import { nanoid } from "nanoid";

// "Coastal Calm" Form Styles
const cardStyle = "w-full max-w-md mx-auto bg-card rounded-2xl shadow-xl p-8";
const inputStyle = "w-full p-3 bg-background text-text-dark border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 transition-all";
const buttonStyle = "w-full font-bold bg-accent-blue text-white py-3 px-8 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-800";
const categoryButtonStyle = "font-bold bg-stone-200 text-text-dark py-2 px-5 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-stone-300";

export default function Login(props) {
    // --- ALL YOUR ORIGINAL LOGIC REMAINS THE SAME ---
    // (Pasting all your functions from `useState` to `completeLogin`)

    const [step, setStep] = useState(0);
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
        pattern: [],
        categories: [],
        sets: []
    });
    const [imageData, setImageData] = useState([]);
    const [iteration, setIteration] = useState(0);
    const [hint, setHint] = useState(""); 

    useEffect(() => {
        if (step === 0 && !loginInfo.username && !loginInfo.password) {
            setHint("Start by entering your username and password.");
        } else if (step === 0 && loginInfo.username && !loginInfo.password) {
            setHint("A strong password helps protect your account.");
        } else if (step === 1 && loginInfo.categories.length === 0) {
            setHint("No categories available. Verify if the API returned correct data.");
        } else if (imageData.length > 0 && loginInfo.pattern.length < 5) {
            setHint(`Select at least 5 images for better security. Currently selected: ${loginInfo.pattern.length}.`);
        } else if (step === 1 && loginInfo.pattern.length === 5) {
            setHint("You are ready to complete the login process. Click the 'Login' button.");
        } else {
            setHint(""); 
        }
    }, [loginInfo, step, imageData]);

    function handleChange(event) {
        setLoginInfo(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    function handleFirstStepSubmit() {
        if (!loginInfo.username || !loginInfo.password) {
            Toast("Please enter username and password!");
            return;
        }
        props.setLoading(true);
        axios.post(`${api.url}/api/user/login`, {
            username: loginInfo.username,
            password: loginInfo.password,
            firstStepOnly: true
        })
        .then(response => {
            props.setLoading(false);
            setLoginInfo(prev => ({
                ...prev,
                categories: response.data.categories,
                sets: response.data.sets
            }));
            setStep(1);
        })
        .catch(err => {
            props.setLoading(false);
            Toast(err.response?.data?.message || "Login failed");
        });
    }

    function getIcons() {
        if (!imageData[iteration]) return null;
        return imageData[iteration].map((prev, index) => (
            <PasswordIcon 
                key={nanoid()}
                iteration={iteration} 
                id={prev.id} 
                src={prev.url} 
                selected={loginInfo.pattern.includes(prev.id)} 
                onClick={() => handleImageClick(prev.id, prev.url, index)}
            />
        ));
    }

    function handleImageClick(id, url, index) {
        setLoginInfo(prev => {
            const patternIndex = prev.pattern.indexOf(id);
            let newPattern = [...prev.pattern];
            if (patternIndex > -1) {
                newPattern.splice(patternIndex, 1);
            } else {
                if (newPattern.length >= 5) {
                    Toast("Maximum 5 images can be selected!");
                    return prev;
                }
                newPattern.push(id);
            }
            return {
                ...prev,
                pattern: newPattern
            };
        });
    }

    function fetchCategoryImages(category) {
        props.setLoading(true);
        const selectedSet = loginInfo.sets.find(set => 
            set.category === category
        );
        if (!selectedSet || !selectedSet.images) {
            props.setLoading(false);
            Toast("No images found for this category");
            return;
        }
        const categorizedImages = [
            selectedSet.images.slice(0, 16).map(img => ({
                id: img.id,
                url: img.url,
                category: category
            }))
        ];
        props.setLoading(false);
        setImageData(categorizedImages);
        setIteration(0);
    }

    function completeLogin() {
        if (loginInfo.pattern.length < 5) {
            Toast(`Select at least 5 images! (Currently ${loginInfo.pattern.length})`);
            return;
        }
        props.setLoading(true);
        axios.post(`${api.url}/api/user/login`, {
            username: loginInfo.username,
            password: loginInfo.password,
            pattern: loginInfo.pattern
        })
        .then(res => {
            props.setLoading(false);
            props.setUserInfo({
                email: res.data.email, 
                username: res.data.username
            });
            props.setLoggedIn(true);
            successToast("Logged In!");
            props.setPage(Page.HOME_PAGE);
        })
        .catch(err => {
            props.setLoading(false);
            Toast(err.response?.data?.message || "Login failed");
        });
    }
    // --- END OF YOUR LOGIC ---

    // --- This is the NEW, RESTYLED JSX ---
    return (
        <div className="container mx-auto px-4 mt-12 mb-24">
            
            {/* Styled Hint Box */}
            {hint && (
                <div className="max-w-md mx-auto bg-blue-100 text-blue-900 p-3 rounded-lg mb-4 text-center">
                    {hint}
                </div>
            )}

            {step === 0 ? (
                <div className={cardStyle}>
                    <h2 className="text-3xl font-bold text-text-dark mb-6 text-center">Login</h2>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={loginInfo.username}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <button
                            onClick={handleFirstStepSubmit}
                            className={`${buttonStyle} mt-4`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-text-dark mb-6">Select Your Pattern</h2>

                    <div className="mb-6">
                        <h3 className="text-text-light text-lg mb-3">Choose Your Categories:</h3>
                        <div className="flex flex-wrap gap-3">
                            {loginInfo.categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => fetchCategoryImages(category)}
                                    className={categoryButtonStyle}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {imageData.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 border-2 border-gray-200 bg-background p-2 rounded-lg">
                            {getIcons()}
                        </div>
                    )}

                    <div className="mt-6">
                        <p className="text-text-light mb-4">
                            Images Selected: {loginInfo.pattern.length}/5
                        </p>
                        <button
                            onClick={completeLogin}
                            className={buttonStyle} // Changed from green to consistent blue
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

