import React, { useState } from "react";
import PasswordIcon from "./Items/PasswordIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import validator from "validator/es";
import axios from "axios";
import { successToast, Toast } from "../util/toast";
import { checkEmail, checkUsername } from "../util/validation";
import { Page } from "../util/config";
import { api } from "../static/config";
import { nanoid } from "nanoid";

export default function Signup(props) {
    const [next, setNext] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [imageData, setImageData] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [signupInfo, setSignupInfo] = useState({
        username: "",
        email: "",
        password: "",
        pattern: [],
        categories: [],
        sets: []
    });

    function handleChange(event) {
        setSignupInfo(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    function getIcons() {
        return imageData.map((img, index) => (
            <PasswordIcon
                key={img.id}
                id={img.id}
                src={img.url}
                selected={signupInfo.pattern.includes(img.id)}
                onClick={() => handleImageClick(img.id, img.url, index)}
            />
        ));
    }

    function handleImageClick(id, url) {
        setSignupInfo((prev) => {
            const patternIndex = prev.pattern.indexOf(id);
            const newPattern = [...prev.pattern];
            let newSets = [...prev.sets];
            let newCategories = [...prev.categories];
    
            if (patternIndex > -1) {
                // Remove image from pattern
                newPattern.splice(patternIndex, 1);
    
                // Remove category if no more images are selected for it
                const categoryIndex = newSets.findIndex((set) =>
                    set.selectedIds.includes(id)
                );
                if (categoryIndex > -1) {
                    newSets[categoryIndex].selectedIds = newSets[categoryIndex].selectedIds.filter(
                        (imageId) => imageId !== id
                    );
    
                    if (newSets[categoryIndex].selectedIds.length === 0) {
                        newCategories = newCategories.filter(
                            (cat) => cat !== newSets[categoryIndex].category
                        );
                    }
                }
            } else {
                if (newPattern.length >= 5) {
                    Toast("Maximum 5 images can be selected!");
                    return prev;
                }
                newPattern.push(id);
    
                // Add category if not already added
                if (!newCategories.includes(keyword)) {
                    newCategories.push(keyword);
                }
    
                // Update sets with selected images for the current category
                const categorySetIndex = newSets.findIndex(
                    (set) => set.category === keyword
                );
                if (categorySetIndex > -1) {
                    newSets[categorySetIndex].selectedIds = [
                        ...newSets[categorySetIndex].selectedIds,
                        id,
                    ];
                } else {
                    newSets.push({
                        category: keyword,
                        images: imageData,
                        selectedIds: [id],
                    });
                }
            }
    
            // Update selected categories state
            setSelectedCategories(newCategories);
    
            return {
                ...prev,
                pattern: newPattern,
                sets: newSets,
                categories: newCategories,
            };
        });
    }
    
    
    function searchKeyword() {
        if (keyword.trim() === "") {
            Toast("Invalid keyword!");
            return;
        }
    
        props.setLoading(true);
        axios
            .get(`${api.url}/api/image/search?keyword=${keyword}`)
            .then((response) => {
                const images = response.data || [];
                if (images.length === 0) {
                    Toast("No images found for this keyword.");
                    return;
                }
    
                setImageData(
                    images.map((img) => ({
                        id: img.id || nanoid(),
                        url: img.url || "",
                        category: keyword,
                    }))
                );
    
                // Ensure sets includes all images for the current category
                setSignupInfo((prev) => {
                    const newSets = [...prev.sets];
                    const categorySetIndex = newSets.findIndex((set) => set.category === keyword);
    
                    if (categorySetIndex > -1) {
                        newSets[categorySetIndex].images = images;
                    } else {
                        newSets.push({
                            category: keyword,
                            images: images,
                            selectedIds: [],
                        });
                    }
    
                    return { ...prev, sets: newSets };
                });
    
                props.setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                props.setLoading(false);
                Toast(err.response?.data?.message || "Image search failed");
            });
    }
    

    function createAccount() {
        if (signupInfo.pattern.length < 5) {
            Toast(`Select at least 5 images! (Currently ${signupInfo.pattern.length})`);
            return;
        }
    
        if (signupInfo.categories.length < 1 || signupInfo.categories.length > 5) {
            Toast("Use at least 1 and at most 5 different categories!");
            return;
        }
    
        console.log("Signup Info:", signupInfo); // Debug here
    
        props.setLoading(true);
        axios
            .post(`${api.url}/api/user/signup`, signupInfo)
            .then(res => {
                props.setLoading(false);
                props.setUserInfo({ email: res.data.email, username: res.data.username });
                props.setLoggedIn(true);
                successToast("Logged In!");
                props.setPage(Page.HOME_PAGE);
            })
            .catch(err => {
                console.error(err);
                props.setLoading(false);
                Toast(err.response?.data?.message || "Signup failed");
            });
    }
    

    function validateData() {
        if (signupInfo.username.length < 1) {
            Toast("Invalid username!");
            return false;
        }
        if (!validator.isEmail(signupInfo.email)) {
            Toast("Invalid email address!");
            return false;
        }
        if (signupInfo.password.length < 8) {
            Toast("Password length should be more than 8");
            return false;
        }
        return true;
    }

    async function validateUsernameAndEmail() {
        const isEmailExist = await checkEmail(signupInfo.email, props.setLoading);
        const isUsernameExists = await checkUsername(signupInfo.username, props.setLoading);

        if (isUsernameExists) Toast("Username already exists!");
        else if (isEmailExist) Toast("Email already exists!");

        return !isEmailExist && !isUsernameExists;
    }

    async function handleNextClick() {
        if (validateData() && await validateUsernameAndEmail()) {
            setNext(true);
        }
    }

    return (
        <div className="container mx-auto px-4 sm:h-[38rem] mt-12">
            {!next ? (
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl text-white mb-4">Create Your Account</h2>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={signupInfo.username}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 bg-gray-700 text-white"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={signupInfo.email}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 bg-gray-700 text-white"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={signupInfo.password}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 bg-gray-700 text-white"
                    />
                    <button 
                        onClick={handleNextClick}
                        className="w-full bg-blue-600 text-white p-2"
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div className="sm:flex h-full">
                    <div className="w-full sm:w-3/4 bg-[#3B3B3B] rounded-lg p-4">
                        <div className="flex items-center mb-4">
                            <input 
                                type="text" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search image category"
                                className="flex-grow p-2 mr-2 bg-gray-700 text-white"
                            />
                            <button 
                                onClick={searchKeyword}
                                className="bg-blue-600 text-white p-2"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                        
                        {imageData.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {getIcons()}
                            </div>
                        )}

                        <div className="mt-4">
                            <p className="text-white mb-2">
                                Selected Categories: {selectedCategories.join(", ")}
                            </p>
                            <p className="text-white mb-2">
                                Images Selected: {signupInfo.pattern.length}/5
                            </p>
                            <button 
                                onClick={createAccount}
                                className="w-full bg-green-600 text-white p-2"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}