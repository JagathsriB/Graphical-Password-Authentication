import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toast, successToast } from "../util/toast";
import { api } from "../static/config";
import { Page } from "../util/config";
import PasswordIcon from "./Items/PasswordIcon";
import { nanoid } from "nanoid";

export default function Login(props) {
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
    const [hint, setHint] = useState(""); // State for managing hints

    useEffect(() => {
        // Generate hints dynamically based on application state
        if (step === 0 && !loginInfo.username && !loginInfo.password) {
            setHint("Start by entering your username and password.");
        } else if (step === 0 && loginInfo.username && !loginInfo.password) {
            setHint("A strong password helps protect your account. Use a mix of letters, numbers, and symbols.");
        } else if (step === 1 && loginInfo.categories.length === 0) {
            setHint("No categories available. Verify if the API returned correct data.");
        } else if (imageData.length > 0 && loginInfo.pattern.length < 5) {
            setHint(`Select at least 5 images for better security. Currently selected: ${loginInfo.pattern.length}.`);
        } else if (step === 1 && loginInfo.pattern.length === 5) {
            setHint("You are ready to complete the login process. Click the 'Login' button.");
        } else {
            setHint(""); // Clear hint if no conditions are met
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

    return (
        <div className="container mx-auto px-4 sm:h-[38rem] mt-12">
            <div className="mb-4 text-white bg-gray-800 p-2 rounded">{hint}</div> {/* Display hint */}
            {step === 0 ? (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl text-white mb-4">Login</h2>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={loginInfo.username}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 bg-gray-700 text-white"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={loginInfo.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 bg-gray-700 text-white"
                    />
                    <button 
                        onClick={handleFirstStepSubmit}
                        className="w-full bg-blue-600 text-white p-2"
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div className="sm:flex h-full">
                    <div className="w-full sm:w-3/4 bg-[#3B3B3B] rounded-lg p-4">
                        <div className="mb-4">
                            <h3 className="text-white text-lg mb-2">Choose Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {loginInfo.categories.map((category, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => fetchCategoryImages(category)}
                                        className="bg-blue-600 text-white p-2 rounded"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {imageData.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {getIcons()}
                            </div>
                        )}

                        <div className="mt-4">
                            <p className="text-white mb-2">
                                Images Selected: {loginInfo.pattern.length}/5
                            </p>
                            <button 
                                onClick={completeLogin}
                                className="w-full bg-green-600 text-white p-2"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}