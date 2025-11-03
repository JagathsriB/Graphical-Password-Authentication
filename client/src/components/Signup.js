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

// New "Coastal Calm" Form Styles
const cardStyle = "w-full max-w-md mx-auto bg-card rounded-2xl shadow-xl p-8";
const inputStyle = "w-full p-3 bg-background text-text-dark border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 transition-all";
const buttonStyle = "w-full font-bold bg-accent-blue text-white py-3 px-8 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-800";
const searchButtonStyle = "font-bold bg-accent-yellow text-text-dark p-3 rounded-lg transition duration-300 hover:scale-105 hover:bg-yellow-300";

export default function Signup(props) {
    // --- ALL YOUR ORIGINAL LOGIC REMAINS THE SAME ---
    // (Pasting all your functions from `useState` to `handleNextClick`)

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
                newPattern.splice(patternIndex, 1);
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
                if (!newCategories.includes(keyword)) {
                    newCategories.push(keyword);
                }
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
        const { sets, ...payload } = signupInfo;
        props.setLoading(true);
        axios
            .post(`${api.url}/api/user/signup`, payload) 
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

    // --- END OF YOUR LOGIC ---

    // --- This is the NEW, RESTYLED JSX ---
    return (
        <div className="container mx-auto px-4 mt-12 mb-24">
            {!next ? (
                <div className={cardStyle}>
                    <h2 className="text-3xl font-bold text-text-dark mb-6 text-center">Create Your Account</h2>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={signupInfo.username}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signupInfo.email}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signupInfo.password}
                            onChange={handleChange}
                            className={inputStyle}
                        />
                        <button
                            onClick={handleNextClick}
                            className={`${buttonStyle} mt-4`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-text-dark mb-6">Choose Your Pattern</h2>
                    
                    <div className="flex items-center mb-6 gap-3">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search image category (e.g., 'cats', 'cars')"
                            className={`${inputStyle} flex-grow`}
                        />
                        <button
                            onClick={searchKeyword}
                            className={searchButtonStyle}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>

                    {imageData.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 border-2 border-gray-200 bg-background p-2 rounded-lg">
                            {getIcons()}
                        </div>
                    )}

                    <div className="mt-6">
                        <p className="text-text-light mb-2">
                            Selected Categories: {selectedCategories.join(", ")}
                        </p>
                        <p className="text-text-light mb-4">
                            Images Selected: {signupInfo.pattern.length}/5
                        </p>
                        <button
                            onClick={createAccount}
                            className={buttonStyle} // Changed from green to the consistent blue
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

